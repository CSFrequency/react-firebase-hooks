import firebase from 'firebase/app';

export type AuthActionHook<T, E> = [
  (email: string, password: string) => void,
  T | undefined,
  boolean,
  E | undefined
];
export type CreateUserOptions = {
  emailVerificationOptions?: firebase.auth.ActionCodeSettings;
  sendEmailVerification?: boolean;
};
export type EmailAndPasswordActionHook = AuthActionHook<
  firebase.auth.UserCredential,
  firebase.FirebaseError
>;
