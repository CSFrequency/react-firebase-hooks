import firebase from 'firebase/app';

type AuthActionHook<T, E> = [
  (email: string, password: string) => void,
  T | undefined,
  boolean,
  E | undefined
];
export type EmailAndPasswordActionHook = AuthActionHook<
  firebase.auth.UserCredential,
  firebase.FirebaseError
>;
