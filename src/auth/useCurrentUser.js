// @flow
// $FlowExpectedError: Pending proper flow types
import { useEffect, useState } from 'react';
import firebase, { type FirebaseUser } from 'firebase/app';
import 'firebase/auth';
import { useDataLoader } from '../util';

export type CurrentUser = {
  user: ?FirebaseUser,
  initialising: boolean,
};

export default (): CurrentUser => {
  const { loading, setValue, value } = useDataLoader<FirebaseUser>();

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged(setValue);

    return () => {
      listener();
    };
  }, []);

  return {
    initialising: loading,
    user: value,
  };
};
