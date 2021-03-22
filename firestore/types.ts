import firebase from 'firebase/app';
import { LoadingHook } from '../util';

export type IDOptions<T> = {
  idField?: string;
  refField?: string;
  snapshotOptions?: firebase.firestore.SnapshotOptions;
  transform?: (val: any) => T;
};
export type Options = {
  snapshotListenOptions?: firebase.firestore.SnapshotListenOptions;
};
export type DataOptions<T> = Options & IDOptions<T>;
export type OnceOptions = {
  getOptions?: firebase.firestore.GetOptions;
};
export type OnceDataOptions<T> = OnceOptions & IDOptions<T>;
export type Data<
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = T &
  Record<IDField, string> &
  Record<RefField, firebase.firestore.DocumentReference<T>>;

export type CollectionHook<T = firebase.firestore.DocumentData> = LoadingHook<
  firebase.firestore.QuerySnapshot<T>,
  firebase.FirebaseError
>;
export type CollectionDataHook<
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = LoadingHook<Data<T, IDField, RefField>[], firebase.FirebaseError>;

export type DocumentHook<T = firebase.firestore.DocumentData> = LoadingHook<
  firebase.firestore.DocumentSnapshot<T>,
  firebase.FirebaseError
>;
export type DocumentDataHook<
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = LoadingHook<Data<T, IDField, RefField>, firebase.FirebaseError>;
