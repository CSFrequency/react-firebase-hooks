// @flow
// $FlowExpectedError: Pending proper flow types
import { useEffect, useState } from 'react';
import firebase, { type FirebaseUser } from 'firebase/app';
import 'firebase/auth';

export type CurrentUser = {
  user: ?FirebaseUser,
  initialising: boolean,
};

export default (): CurrentUser => {
  const [user, setUser] = useState(null);
  const [initialising, setInitialising] = useState(true);

  const onAuthStateChanged = (user: ?FirebaseUser) => {
    setUser(user);
    setInitialising(false);
  };

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged(onAuthStateChanged);

    return () => {
      listener();
    };
  }, []);

  return {
    initialising,
    user,
  };
};
