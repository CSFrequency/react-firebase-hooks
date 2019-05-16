# React Firebase Hooks - Auth

React Firebase Hooks provides a convenience listener for Firebase Auth's auth state. The hook wraps around the `firebase.auth().onAuthStateChange()` method to ensure that it is always up to date.

All hooks can be imported from `react-firebase-hooks/auth`, e.g.

```
import { useAuthState } from 'react-firebase-hooks/auth';
```

List of Auth hooks:

- [useAuthState](#useauthstate)

### useAuthState

```
const [user, loading, error] = useAuthState(auth);
```

Returns the `firebase.User` (if logged in), a boolean to indicate whether the the user is still being loaded and any `firebase.FirebaseError` returned by Firebase when trying to load the user.

The `useAuthState` hook takes the following parameters:

- `auth`: `firebase.auth.Auth` instance for the app you would like to monitor

#### Full Example

```js
import { useAuthState } from 'react-firebase-hooks/auth';

const CurrentUser = () => {
  const [user, initialising, error] = useAuthState(firebase.auth());
  const login = () => {
    firebase.auth().signInWithEmailAndPassword('test@test.com', 'password');
  };
  const logout = () => {
    firebase.auth().signOut();
  };

  if (initialising) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}>/p>
      </div>
    )
  }
  if (user) {
    return (
      <div>
        <p>Current User: {user.email}</p>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }
  return <button onClick={login}>Log in</button>;
};
```
