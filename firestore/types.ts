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
export type InitialValueOptions<T> = {
  initialValue?: T;
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
export type CollectionOnceHook<T = DocumentData> = [
  ...CollectionHook<T>,
  () => Promise<void>
];

export type CollectionCountHook<T = DocumentData> = LoadingHook<
  number,
  FirestoreError
>;

export type CollectionCountOnceHook<T = DocumentData> = [
  ...CollectionCountHook<T>,
  () => Promise<void>
];
export type CollectionDataHook<T = DocumentData> = [
  ...LoadingHook<T[], FirestoreError>,
  QuerySnapshot<T> | undefined
];
export type CollectionDataOnceHook<T = DocumentData> = [
  ...CollectionDataHook<T>,
  () => Promise<void>
];

export type DocumentHook<T = DocumentData> = LoadingHook<
  DocumentSnapshot<T>,
  FirestoreError
>;
export type DocumentOnceHook<T = DocumentData> = [
  ...DocumentHook<T>,
  () => Promise<void>
];
export type DocumentDataHook<T = DocumentData> = [
  ...LoadingHook<T, FirestoreError>,
  DocumentSnapshot<T> | undefined
];
export type DocumentDataOnceHook<T = DocumentData> = [
  ...DocumentDataHook<T>,
  () => Promise<void>
];
