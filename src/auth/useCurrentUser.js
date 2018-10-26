// @flow
// $FlowExpectedError: Pending proper flow types
import { useEffect, useState } from 'react';
import firebase, { type FirebaseUser } from 'firebase/app';
import 'firebase/auth';

export default (): ?FirebaseUser => {
  const [currentUser, setCurrentUser] = useState(firebase.auth().currentUser);

  const onAuthStateChanged = (currentUser: ?FirebaseUser) => {
    setCurrentUser(currentUser);
  };

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged(onAuthStateChanged);

    return () => {
      listener();
    };
  });

  return currentUser;
};
