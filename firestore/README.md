# React Firebase Hooks - Cloud Firestore

React Firebase Hooks provides convenience listeners for Collections and Documents stored with Cloud Firestore. The hooks wrap around the `firestore.onSnapshot(...)` method.

In addition to returning the snapshot value, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading and listening to Cloud Firestore.

There are 2 variants of each hook:

- `useX` which subscribes to the underlying Collection or Document and listens for changes
- `useXOnce` which reads the current value of the Collection or Document

All hooks can be imported from `react-firebase-hooks/firestore`, e.g.

```js
import { useCollection } from 'react-firebase-hooks/firestore';
```

List of Cloud Firestore hooks:

- [React Firebase Hooks - Cloud Firestore](#react-firebase-hooks---cloud-firestore)
  - [useCollection](#usecollection)
    - [Full example](#full-example)
  - [useCollectionOnce](#usecollectiononce)
  - [useCollectionData](#usecollectiondata)
  - [useCollectionDataOnce](#usecollectiondataonce)
  - [useDocument](#usedocument)
    - [Full example](#full-example-1)
  - [useDocumentOnce](#usedocumentonce)
  - [useDocumentData](#usedocumentdata)
  - [useDocumentDataOnce](#usedocumentdataonce)
  - [Transforming data](#transforming-data)

Additional functionality:

- [Transforming data](#transforming-data)

### useCollection

```js
const [snapshot, loading, error] = useCollection(query, options);
```

Retrieve and monitor a collection value in Cloud Firestore.

Returns a `firestore.QuerySnapshot` (if a query is specified), a `boolean` to indicate if the data is still being loaded and any `firestore.FirestoreError` returned by Firebase when trying to load the data.

The `useCollection` hook takes the following parameters:

- `query`: (optional) `firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `snapshotListenOptions`: (optional) `firestore.SnapshotListenOptions` to customise how the query is loaded

Returns:

- `snapshot`: a `firestore.QuerySnapshot`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error

#### Full example

```js
import { getFirestore, collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

const FirestoreCollection = () => {
  const [value, loading, error] = useCollection(
    collection(getFirestore(firebaseApp), 'hooks'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div>
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <span>
            Collection:{' '}
            {value.docs.map((doc) => (
              <React.Fragment key={doc.id}>
                {JSON.stringify(doc.data())},{' '}
              </React.Fragment>
            ))}
          </span>
        )}
      </p>
    </div>
  );
};
```

### useCollectionOnce

```js
const [snapshot, loading, error] = useCollectionOnce(query, options);
```

Retrieve the current value of the `firestore.Query`.

The `useCollectionOnce` hook takes the following parameters:

- `query`: (optional) `firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `Object` to customise how the collection is loaded
    - `source`: (optional): `'default' | 'server' | 'cache'` Describes whether we should get from server or cache.

Returns:

- `snapshot`: a `firestore.QuerySnapshot`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error
- `reload()`: a function that can be called to trigger a reload of the data

### useCollectionData

```js
const [values, loading, error, snapshot] =
  useCollectionData < T > (query, options);
```

As `useCollection`, but this hook extracts a typed list of the `firestore.QuerySnapshot.docs` values, rather than the
`firestore.QuerySnapshot` itself.

The `useCollectionData` hook takes the following parameters:

- `query`: (optional) `firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `initialValue`: (optional) the initial value returned by the hook, until data from the firestore query has loaded
  - `snapshotListenOptions`: (optional) `firestore.SnapshotListenOptions` to customise how the collection is loaded
  - `snapshotOptions`: (optional) `firestore.SnapshotOptions` to customise how data is retrieved from snapshots

Returns:

- `values`: an array of `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error
- `snapshot`: a `firestore.QuerySnapshot`, or `undefined` if no query is supplied. This allows access to the underlying snapshot if needed for any reason, e.g. to view the snapshot metadata

See [Transforming data](#transforming-data) for how to transform data as it leaves Firestore and access the underlying `id` and `ref` fields of the snapshot.

### useCollectionDataOnce

```js
const [values, loading, error, snapshot] =
  useCollectionDataOnce < T > (query, options);
```

As `useCollectionData`, but this hook will only read the current value of the `firestore.Query`.

The `useCollectionDataOnce` hook takes the following parameters:

- `query`: (optional) `firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `Object` to customise how the collection is loaded
    - `source`: (optional): `'default' | 'server' | 'cache'` Describes whether we should get from server or cache.
  - `initialValue`: (optional) the initial value returned by the hook, until data from the firestore query has loaded
  - `snapshotOptions`: (optional) `firestore.SnapshotOptions` to customise how data is retrieved from snapshots

Returns:

- `values`: an array of `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error
- `snapshot`: a `firestore.QuerySnapshot`, or `undefined` if no query is supplied. This allows access to the underlying snapshot if needed for any reason, e.g. to view the snapshot metadata
- `reload()`: a function that can be called to trigger a reload of the data

See [Transforming data](#transforming-data) for how to transform data as it leaves Firestore and access the underlying `id` and `ref` fields of the snapshot.

### useDocument

```js
const [snapshot, loading, error] = useDocument(reference, options);
```

Retrieve and monitor a document value in Cloud Firestore.

The `useDocument` hook takes the following parameters:

- `reference`: (optional) `firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `snapshotListenOptions`: (optional) `firestore.SnapshotListenOptions` to customise how the query is loaded

Returns:

- `snapshot`: a `firestore.DocumentSnapshot`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error

#### Full example

```js
import { getFirestore, doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';

const FirestoreDocument = () => {
  const [value, loading, error] = useDocument(
    doc(getFirestore(firebaseApp), 'hooks', 'nBShXiRGFAhuiPfBaGpt'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div>
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Document: Loading...</span>}
        {value && <span>Document: {JSON.stringify(value.data())}</span>}
      </p>
    </div>
  );
};
```

### useDocumentOnce

```js
const [snapshot, loading, error, reload] = useDocumentOnce(reference, options);
```

Retrieve the current value of the `firestore.DocumentReference`.

The `useDocumentOnce` hook takes the following parameters:

- `reference`: (optional) `firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `Object` to customise how the collection is loaded
    - `source`: (optional): `'default' | 'server' | 'cache'` Describes whether we should get from server or cache.

Returns:

- `snapshot`: a `firestore.DocumentSnapshot`, or `undefined` if no reference is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error
- `reload()`: a function that can be called to trigger a reload of the data

### useDocumentData

```js
const [value, loading, error, snapshot] =
  useDocumentData < T > (reference, options);
```

As `useDocument`, but this hook extracts the typed contents of `firestore.DocumentSnapshot.data()`, rather than the
`firestore.DocumentSnapshot` itself.

The `useDocumentData` hook takes the following parameters:

- `reference`: (optional) `firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `initialValue`: (optional) the initial value returned by the hook, until data from the firestore query has loaded
  - `snapshotListenOptions`: (optional) `firestore.SnapshotListenOptions` to customise how the collection is loaded
  - `snapshotOptions`: (optional) `firestore.SnapshotOptions` to customise how data is retrieved from snapshots

Returns:

- `value`: `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error
- `snapshot`: a `firestore.DocumentSnapshot`, or `undefined` if no query is supplied. This allows access to the underlying snapshot if needed for any reason, e.g. to view the snapshot metadata

See [Transforming data](#transforming-data) for how to transform data as it leaves Firestore and access the underlying `id` and `ref` fields of the snapshot.

### useDocumentDataOnce

```js
const [value, loading, error, snapshot, reload] =
  useDocumentDataOnce < T > (reference, options);
```

As `useDocument`, but this hook will only read the current value of the `firestore.DocumentReference`.

The `useDocumentDataOnce` hook takes the following parameters:

- `reference`: (optional) `firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `Object` to customise how the collection is loaded
    - `source`: (optional): `'default' | 'server' | 'cache'` Describes whether we should get from server or cache
  - `initialValue`: (optional) the initial value returned by the hook, until data from the firestore query has loaded
  - `snapshotOptions`: (optional) `firestore.SnapshotOptions` to customise how data is retrieved from snapshots

Returns:

- `value`: `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error
- `snapshot`: a `firestore.DocumentSnapshot`, or `undefined` if no query is supplied. This allows access to the underlying snapshot if needed for any reason, e.g. to view the snapshot metadata
- `reload()`: a function that can be called to trigger a reload of the data

See [Transforming data](#transforming-data) for how to transform data as it leaves Firestore and access the underlying `id` and `ref` fields of the snapshot.

## Transforming data

Firestore allows a restricted number of data types in its store, which may not be flexible enough for your application. As of Firebase 9, there is a built in FirestoreDataConverter which allows you to transform data as it leaves the Firestore database, as well as access the `id` and `ref` fields of the underlying snapshot. This is described here: https://firebase.google.com/docs/reference/js/firestore_.firestoredataconverter

> NOTE: This replaces the `transform`, `idField` and `refField` options that were available in `react-firebase-hooks` v4 and earlier.

### Example

```js
type Post = {
  author: string,
  id: string,
  ref: DocumentReference<DocumentData>,
  title: string,
};

const postConverter: FirestoreDataConverter<Post> = {
  toFirestore(post: WithFieldValue<Post>): DocumentData {
    return { author: post.author, title: post.title };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Post {
    const data = snapshot.data(options);
    return {
      author: data.author,
      id: snapshot.id,
      ref: snapshot.ref,
      title: data.title,
    };
  },
};

const ref = collection(firestore, 'posts').withConverter(postConverter);
const [data, loading, error] = useCollectionData(ref);
```
