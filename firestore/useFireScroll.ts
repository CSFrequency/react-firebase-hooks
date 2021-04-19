import firebase from 'firebase';
import * as React from 'react';
import {useIsEqualRef, useLoadingValue} from "../util";

class FireScrollState<T> {
  constructor(
    /**
     * Docs that are tracked by a realtime Firestore listener. This is only done for the
     * first page while the rest are non-realtime.
     */
    public realtimeDocs: firebase.firestore.QueryDocumentSnapshot<T>[] = [],
    /**
     * All non-realtime docs that have been fetched after the first realtime page.
     */
    public otherDocs: firebase.firestore.QueryDocumentSnapshot<T>[] = [],
    /**
     * True if the query has not yet run out of results, else false.
     */
    public moreDataAvailable = true,
    /**
     * Count of page fetches that have returned results.
     */
    public currentPage = 0,
    /**
     * Query cursor that marks the last or bottom-most document from the entire
     * result set. Each page query starts immediately after this document.
     */
    public lastDocFetched?: firebase.firestore.QueryDocumentSnapshot<T>,
    /**
     * True if a page is actively being fetched, else false. For the first page,
     * this is only true the first time the listener pulls down documents.
     */
    public fetchInProgress = true,
  ) {}

  /**
   * Ordered list of all documents that have been fetched so far.
   */
  public docs(): firebase.firestore.QueryDocumentSnapshot<T>[] {
    return [...this.realtimeDocs, ...this.otherDocs];
  }

  /**
   * Create new instance of state with a shallow copy of all unspecified params.
   * @param args
   */
  public copyWith(
    args: Partial<{
      realtimeDocs: firebase.firestore.QueryDocumentSnapshot<T>[];
      otherDocs: firebase.firestore.QueryDocumentSnapshot<T>[];
      moreDataAvailable: boolean;
      currentPage: number;
      lastDocFetched: firebase.firestore.QueryDocumentSnapshot<T>;
      isLoading: boolean;
      error: Error;
    }> = {},
  ): FireScrollState<T> {
    return new FireScrollState<T>(
      args.realtimeDocs || this.realtimeDocs,
      args.otherDocs || this.otherDocs,
      args.moreDataAvailable || this.moreDataAvailable,
      args.currentPage || this.currentPage,
      args.lastDocFetched || this.lastDocFetched,
      args.isLoading || this.fetchInProgress,
    );
  }
}

/**
 * Type of {@link FlatListProps.onEndReached} callback.
 */
export type OnEndReachedCallback = (info: { distanceFromEnd: number }) => void;

/**
 * React hook return type.
 */
export type FireScrollResult<T> = [
  /**
   * All documents that have been fetched.
   */
  firebase.firestore.QueryDocumentSnapshot<T>[],
  /**
   * isLoading
   */
  boolean,
  /**
   * Possible error
   */
    Error | undefined,
  /**
   * Callback handler to be passed into {@link FlatListProps.onEndReached}
   */
  OnEndReachedCallback
];

/**
 * Firestore infinite scroll hook.
 *
 * This begins by starting a realtime listener for the first page of results and handles
 * additions, deletions, and modifications to that result set {@link listenToFirstPage}.
 *
 * After the listener has initialized then more pages will be loaded automatically when the returned
 * {@link OnEndReachedCallback} is invoked. This callback should be passed by the hook user
 * into a {@link FlatListProps.onEndReached} prop.
 *
 * @param query the base Firestore query
 * @param defaultPageSize number of documents to fetch for all pages except possibly the first
 * @param firstPageSize number of documents to listen to for the first page
 */
export function useFireScroll<T>(
  query: firebase.firestore.Query<T>,
  defaultPageSize: number,
  firstPageSize: number = defaultPageSize,
): FireScrollResult<T> {
  /**
   * Callback to close Firestore listener.
   */
  const closeListenerCallback = React.useRef<() => void>();

  const { error, loading, reset, setError, setValue, value } = useLoadingValue<FireScrollState<T>, Error>(
    () => new FireScrollState<T>(),
  );

  const queryRef = useIsEqualRef(query, reset);

  /**
   * Returns true if the hook should be allowed to fetch a new page.
   */
  function canFetch(): boolean {
    if (!value) {
      return false;
    }
    if (value.fetchInProgress && isDefined(value.lastDocFetched)) {
      console.debug("Can't fetch because a fetch is already in progress");
      return false;
    }
    if (!value.moreDataAvailable) {
      console.debug("Can't fetch because there isn't any more data available");
      return false;
    }
    return true;
  }

  /**
   * Listen to the first page of results.
   * @returns cleanup function
   */
  function listenToFirstPage(): () => void {
    if (!canFetch()) {
      return () => null;
    }

    if (isDefined(closeListenerCallback.current)) {
      console.warn('Listener should not be called more than once. Closing previous listener');
      closeListenerCallback.current();
      closeListenerCallback.current = undefined;
    }

    // The result of the snapshot listener method is a callback that can be called to close the listener.
    closeListenerCallback.current = query.limit(firstPageSize).onSnapshot(onNext, onError);

    // Cleanup function for useEffect
    return () => {
      console.info('Closing listener');
      closeListenerCallback.current && closeListenerCallback.current();
      closeListenerCallback.current = undefined;
    };

    /**
     * Firestore listener snapshot callback
     * @param snapshot
     */
    function onNext(snapshot: firebase.firestore.QuerySnapshot<T>): void {
      let snapshotPath: string | undefined = undefined;
      if (snapshot.size > 0) {
        snapshotPath = snapshot.docs[0].ref.parent.path;
      }
      console.debug('Received changes from realtime listener', {
        results: snapshot.size,
        changes: snapshot.docChanges().length,
        path: snapshotPath,
      });

      if (!value) {
        console.warn('Listener snapshot was received while state is in an undefined state');
        return;
      }

      const firstTimeFetch = value.realtimeDocs.length === 0 && value.moreDataAvailable;

      if (firstTimeFetch) {
        // Once the first page fetch has finished, we are technically always fetching new data
        // so this flag becomes owned by the non-realtime fetch method.
        value.fetchInProgress = false;
      } else {
        // This is an update, not a first-time fetch
        const numAdded = snapshot.docChanges().filter((c) => c.type === 'added').length;
        const numRemoved = snapshot.docChanges().filter((c) => c.type === 'removed').length;
        // When a new document is created and meets the listener query criteria it will push an old document out and add
        // the new one in. The old document is no longer being listened to so we should add it to the non-realtime result
        // set.
        const numDisplaced = Math.min(numAdded, numRemoved);
        if (numDisplaced > 0) {
          console.debug('Realtime listener has displaced documents', { count: numDisplaced });
        }

        let currentDisplaced = 0;
        for (const docChange of snapshot.docChanges()) {
          console.debug('Document changed', { doc: docChange.doc.ref.id, type: docChange.type });
          if (docChange.type === 'removed') {
            if (currentDisplaced < numDisplaced) {
              // Add the document that was pushed out of the listener to the list of non-realtime results
              value.otherDocs.unshift(docChange.doc);
              currentDisplaced++;
            } else {
              // it was truly deleted and should disappear as desired when the real-time list is overwritten
            }
          } else if (docChange.type === 'added') {
            // If a document is added, it might have previously been in the non-realtime result set. If so, remove
            // it so that we don't have a duplicate when we combine the lists.
            const nonRealtimeIndex = value.otherDocs.findIndex((r) => r.ref.id === docChange.doc.ref.id);
            if (nonRealtimeIndex >= 0) {
              console.debug('Moving document from non-realtime to realtime list', { doc: docChange.doc.ref.id });
              value.otherDocs.splice(nonRealtimeIndex, 1);
            }
          }
        }
      }

      value.realtimeDocs = snapshot.docs;

      if (snapshot.size < firstPageSize) {
        console.debug('Results were smaller than page size so no more data is available');
        value.moreDataAvailable = false;
      }
      if (snapshot.size > 0) {
        if (value.currentPage === 0) {
          value.currentPage = 1;
        }
        if (value.otherDocs.length === 0) {
          console.debug('Setting query cursor to last realtime doc');
          value.lastDocFetched = last(value.realtimeDocs);
        } else {
          console.debug('Setting query cursor to last non-realtime doc');
          value.lastDocFetched = last(value.otherDocs);
        }
        console.debug('Successfully loaded realtime results');
      } else {
        console.debug('Staying on same page because query returned zero new results', { page: value.currentPage });
      }

      setValue(value.copyWith());
    }

    /**
     * Firestore listener error callback
     * @param error
     */
    function onError(error: Error): void {
      console.error(error, 'Snapshot listener error');
      setError(error);
    }
  }

  /**
   * Fetch a new non-realtime page if one is available.
   * @return the new updated state
   */
  async function fetchNewPage(): Promise<FireScrollState<T>> {
    if (!value) {
      throw new Error('Attempted to fetch page while state is undefined');
    }
    if (!canFetch()) {
      return value;
    }
    if (value.realtimeDocs.length < firstPageSize) {
      // Don't fetch a new non-realtime page until the realtime listener has a full set
      console.debug('Skipping page fetch because realtime listener does not have a complete result set');
      return value;
    }

    /*
    TODO - Right now this can't be used to show a UI indicator because this function doesn't
    return the state until the fetch has completed and this is set back to false. We'd need
    to invoke the fetch query in a non-blocking manner and return from this function while the
    fetch is still in progress.

    Right now it's used as an internal tracking mechanism to ensure that we don't fetch multiple
    pages at the same time.
     */
    value.fetchInProgress = true;

    let snapshot: firebase.firestore.QuerySnapshot<T>;
    if (value.lastDocFetched) {
      console.debug('Fetching new page', {
        pageSize: defaultPageSize,
        startedAfter: value.lastDocFetched.ref.id,
      });
      snapshot = await query.startAfter(value.lastDocFetched).limit(defaultPageSize).get();
    } else {
      console.debug('Fetching new page from the beginning', { pageSize: defaultPageSize });
      snapshot = await query.limit(defaultPageSize).get();
    }

    console.debug('Received results', { count: snapshot.size });

    if (snapshot.size < defaultPageSize) {
      console.debug('Results were smaller than page size so no more data is available');
      value.moreDataAvailable = false;
    }
    if (snapshot.size > 0) {
      value.lastDocFetched = last<firebase.firestore.QueryDocumentSnapshot<T>>(snapshot.docs);
      value.currentPage++;
      console.debug('Successfully loaded page', { page: value.currentPage });
    } else {
      console.debug('Staying on same page because query returned zero new results', { page: value.currentPage });
    }
    value.otherDocs.push(...snapshot.docs);

    value.fetchInProgress = false;
    return value.copyWith();
  }

  /**
   * Callback to be invoked when the scroll index has passed the
   * threshold to trigger a new page fetch.
   */
  async function onEndReached() {
    const newState = await fetchNewPage();
    setValue(newState);
  }

  React.useEffect(() => {
    if (!value) {
      throw new Error('Attempted to initialize hook while state was undefined');
    }
    console.debug(`Fetching first page`);
    reset();
    return listenToFirstPage();
  }, [queryRef.current]);

  return [(value && value.docs()) || [], loading, error || undefined, onEndReached];
}


function last<T>(arr: T[]): T | undefined {
  if (arr.length > 0) {
    return arr[arr.length - 1];
  } else {
    return undefined;
  }
}

function isDefined<T>(arg: T | undefined | null): arg is T {
  return arg !== undefined && arg !== null;
}
