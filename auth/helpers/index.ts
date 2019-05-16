import { auth, FirebaseError } from 'firebase';

export const transformError = (error: auth.Error): FirebaseError => {
  return {
    message: error.message,
    stack: '',
    name: '',
    code: error.code,
  };
};
