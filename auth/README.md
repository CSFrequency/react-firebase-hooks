# React Firebase Hooks - Auth

React Firebase Hooks provides a convenience listener for Firebase Auth's auth state. The hook wraps around the `firebase.auth().onAuthStateChange()` method to ensure that it is always up to date.

All hooks can be imported from `react-firebase-hooks/auth`, e.g.

```js
import { useAuthState } from 'react-firebase-hooks/auth';
```

List of Auth hooks:

- [useAuthState](#useauthstate)
- [useRegister](#useregister)
- [useLogin](#uselogin)

### useAuthState

```js
const [user, loading, error] = useAuthState(auth);
```

Retrieve and monitor the authentication state from Firebase.

The `useAuthState` hook takes the following parameters:

- `auth`: `firebase.auth.Auth` instance for the app you would like to monitor

Returns:

- `user`: The `firebase.User` if logged in, or `undefined` if not
- `loading`: A `boolean` to indicate whether the the authentication state is still being loaded
- `error`: Any `firebase.auth.Error` returned by Firebase when trying to load the user, or `undefined` if there is no error

#### If you are registering or logingIn the user for the first time consider using [useRegister](#useregister), [useLogin](#uselogin)

#### Full Example

```js
import { useAuthState } from 'react-firebase-hooks/auth';

const login = () => {
  firebase.auth().signInWithEmailAndPassword('test@test.com', 'password');
};
const logout = () => {
  firebase.auth().signOut();
};

const CurrentUser = () => {
  const [user, loading, error] = useAuthState(firebase.auth());

  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
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

### useRegister

```js
const [registeredUser, error, register, loading] = useRegister( auth, email, password );
```

Import statement :

```js
import { useRegister } from 'react-firebase-hooks/auth';
```

For full full example [check here](#register-and-login-hook-usage)

Register a user and receive the user credentials

The `useRegister` hook takes the following parameters:

- `auth`: `firebase.auth.Auth` instance for the app you would like to monitor
- `email`: `string` email of the user
- `password`: `string` password of the user

Returns:

- `registeredUser`: The `registeredUser` if data is received or `undefined` if not
- `loading`: A `boolean` to indicate whether the the registration is completed or it's yet processing
- `error`: `any` returned by Firebase when trying to register the user, or `undefined` if there is no error
- `register`: `void` a function you can call to start the registration

### useLogin

```js
const [loggedInUser, error, login, loading] = useLogin(auth, email, password);
```

Import statement :

```js
import { useLogin } from 'react-firebase-hooks/auth';
```

For full full example [check here](#register-and-login-hook-usage)

Register a user and receive the user credentials

The `useLogin` hook takes the following parameters:

- `auth`: `firebase.auth.Auth` instance for the app you would like to monitor
- `email`: `string` email of the user
- `password`: `string` password of the user

Returns:

- `loggedInUser`: The `loggedInUser` if data is received or `undefined` if not
- `loading`: A `boolean` to indicate whether the the login process is completed or it's yet processing
- `error`: `any` returned by Firebase when trying to register the user, or `undefined` if there is no error
- `login`: `void` a function you can call to start the login process

## Register and Login hook usage

```jsx
import React, { useState } from 'react';
import { auth } from './firebase';
import { useLogin, useRegister } from 'react-firebase-hooks/auth';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedInUser, error, login, loading] = useLogin(auth, email, password);
  const [registeredUser, error, register, loading] = useRegister(auth, email, password);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (loggedInUser) {
    return (
      <div>
        <p>Currently LoggedIn User: {loggedInUser.email}</p>
      </div>
    );
  }
  if (registeredUser) {
    return (
      <div>
        <p>Currently Registered User: {loggedInUser.email}</p>
      </div>
    );
  }
  return (
    <div className="App">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>SIGN IN</button>
      <button onClick={register}>SIGN UP</button>
    </div>
  );
}

export default App;
```
