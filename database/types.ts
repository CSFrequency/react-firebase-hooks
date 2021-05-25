import firebase from 'firebase/compat/app';
import { LoadingHook } from '../util';

export type Val<
  T,
  KeyField extends string = '',
  RefField extends string = ''
> = T &
  Record<KeyField, string> &
  Record<RefField, firebase.database.Reference>;

export type ObjectHook = LoadingHook<
  firebase.database.DataSnapshot,
  firebase.FirebaseError
>;
export type ObjectValHook<
  T,
  KeyField extends string = '',
  RefField extends string = ''
> = LoadingHook<Val<T, KeyField, RefField>, firebase.FirebaseError>;

export type ListHook = LoadingHook<
  firebase.database.DataSnapshot[],
  firebase.FirebaseError
>;
export type ListKeysHook = LoadingHook<string[], firebase.FirebaseError>;
export type ListValsHook<
  T,
  KeyField extends string = '',
  RefField extends string = ''
> = LoadingHook<Val<T, KeyField, RefField>[], firebase.FirebaseError>;
