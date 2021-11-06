import {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FirestoreError,
  QuerySnapshot,
  SnapshotListenOptions,
  SnapshotOptions,
} from 'firebase/firestore';
import { LoadingHook } from '../util';

export type IDOptions<T> = {
  idField?: string;
  refField?: string;
  snapshotOptions?: SnapshotOptions;
  transform?: (val: any) => T;
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
export type Data<
  T = DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = T & Record<IDField, string> & Record<RefField, DocumentReference<T>>;

export type CollectionHook<T = DocumentData> = LoadingHook<
  QuerySnapshot<T>,
  FirestoreError
>;
export type CollectionDataHook<
  T = DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = LoadingHook<Data<T, IDField, RefField>[], FirestoreError>;

export type DocumentHook<T = DocumentData> = LoadingHook<
  DocumentSnapshot<T>,
  FirestoreError
>;
export type DocumentDataHook<
  T = DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = LoadingHook<Data<T, IDField, RefField>, FirestoreError>;
