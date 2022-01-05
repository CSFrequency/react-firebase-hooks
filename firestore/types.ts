import {
  DocumentData,
  DocumentSnapshot,
  FirestoreError,
  QuerySnapshot,
  SnapshotListenOptions,
  SnapshotOptions,
} from 'firebase/firestore';
import { LoadingHook } from '../util';

export type IDOptions<T> = {
  snapshotOptions?: SnapshotOptions;
};
export type Options = {
  snapshotListenOptions?: SnapshotListenOptions;
};
export type DataOptions<T> = Options & IDOptions<T>;
export type OnceOptions = {
  getOptions?: GetOptions;
};
export type GetOptions = {
  source?: 'default' | 'server' | 'cache';
};
export type OnceDataOptions<T> = OnceOptions & IDOptions<T>;

export type CollectionHook<T = DocumentData> = LoadingHook<
  QuerySnapshot<T>,
  FirestoreError
>;
export type CollectionDataHook<T = DocumentData> = LoadingHook<
  T[],
  FirestoreError
>;

export type DocumentHook<T = DocumentData> = LoadingHook<
  DocumentSnapshot<T>,
  FirestoreError
>;
export type DocumentDataHook<T = DocumentData> = LoadingHook<T, FirestoreError>;
