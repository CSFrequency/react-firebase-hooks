import { FirebaseError } from 'firebase';

export const transformError = (error: Error): FirebaseError => {
  return {
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: ''
  }
}