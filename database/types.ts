import { DatabaseReference, DataSnapshot } from 'firebase/database';
import { LoadingHook } from '../util';

export type Val<
  T,
  KeyField extends string = '',
  RefField extends string = ''
> = T & Record<KeyField, string> & Record<RefField, DatabaseReference>;

export type ObjectHook = LoadingHook<DataSnapshot, Error>;
export type ObjectValHook<
  T,
  KeyField extends string = '',
  RefField extends string = ''
> = LoadingHook<Val<T, KeyField, RefField>, Error>;

export type ListHook = LoadingHook<DataSnapshot[], Error>;
export type ListKeysHook = LoadingHook<string[], Error>;
export type ListValsHook<
  T,
  KeyField extends string = '',
  RefField extends string = ''
> = LoadingHook<Val<T, KeyField, RefField>[], Error>;
