import firebase from 'firebase/app';
import { LoadingHook } from '../util';

type IDOptions = {
  idField?: string;
  refField?: string;
};
export type Options = {
  snapshotListenOptions?: firebase.firestore.SnapshotListenOptions;
};
export type DataOptions = Options & IDOptions;
export type OnceOptions = {
  getOptions?: firebase.firestore.GetOptions;
};
export type OnceDataOptions = OnceOptions & IDOptions;
export type Data<
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = T & Record<IDField, string> & Record<RefField, string>;

export type CollectionHook<T = firebase.firestore.DocumentData> = LoadingHook<
  firebase.firestore.QuerySnapshot<T>,
  Error
>;
export type CollectionDataHook<
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = LoadingHook<Data<T, IDField, RefField>[], Error>;

export type DocumentHook<T = firebase.firestore.DocumentData> = LoadingHook<
  firebase.firestore.DocumentSnapshot<T>,
  Error
>;
export type DocumentDataHook<
  T = firebase.firestore.DocumentData,
  IDField extends string = '',
  RefField extends string = ''
> = LoadingHook<Data<T, IDField, RefField>, Error>;
