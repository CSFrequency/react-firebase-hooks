# React Firebase Hooks - Auth

React Firebase Hooks provides a convenience listener for Firebase Auth's auth state. The hook wraps around the `firebase.auth().onAuthStateChange()` method to ensure that it is always up to date.

All hooks can be imported from `react-firebase-hooks/auth`, e.g.

```js
import { useAuthState } from 'react-firebase-hooks/auth';
```

List of Auth hooks:

- [useAuthState](#useauthstate)
- [useCreateUserWithEmailAndPassword](#usecreateuserwithemailandpassword)
- [useSignInWithEmailAndPassword](#usesigninwithemailandpassword)

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

#### If you are registering or signing in the user for the first time consider using [useCreateUserWithEmailAndPassword](#usecreateuserwithemailandpassword), [useSignInWithEmailAndPassword](#usesigninwithemailandpassword)

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

### useCreateUserWithEmailAndPassword

```js
const [
  createUserWithEmailAndPassword,
  user,
  loading,
  error,
] = useCreateUserWithEmailAndPassword(auth);
```

Create a user with email and password. Wraps the underlying `firebase.auth().createUserWithEmailAndPassword` method and provides additional `loading` and `error` information.

The `useCreateUserWithEmailAndPassword` hook takes the following parameters:

- `auth`: `firebase.auth.Auth` instance for the app you would like to monitor
- `options`: (optional) `Object` with the following parameters:
  - `emailVerificationOptions`: (optional) `firebase.auth.ActionCodeSettings` to customise the email verification
  - `sendEmailVerification`: (optional) `boolean` to trigger sending of an email verification after the user has been created

Returns:

- `createUserWithEmailAndPassword(email: string, password: string)`: a function you can call to start the registration
- `user`: The `firebase.User` if the user was created or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user creation is processing
- `error`: Any `firebase.auth.Error` returned by Firebase when trying to create the user, or `undefined` if there is no error

#### Full Example

```jsx
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

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
  if (user) {
    return (
      <div>
        <p>Registered User: {user.email}</p>
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
      <button onClick={() => createUserWithEmailAndPassword(email, password)}>
        Register
      </button>
    </div>
  );
};
```

### useSignInWithEmailAndPassword

```js
const [
  signInWithEmailAndPassword,
  user,
  loading,
  error,
] = useSignInWithEmailAndPassword(auth, email, password);
```

Login a user with email and password. Wraps the underlying `firebase.auth().signInWithEmailAndPassword` method and provides additional `loading` and `error` information.

The `useSignInWithEmailAndPassword` hook takes the following parameters:

- `auth`: `firebase.auth.Auth` instance for the app you would like to monitor

Returns:

- `signInWithEmailAndPassword(email: string, password: string)`: a function you can call to start the login
- `user`: The `firebase.User` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `firebase.auth.Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full Example

```jsx
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

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
  if (user) {
    return (
      <div>
        <p>Signed In User: {user.email}</p>
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
      <button onClick={() => signInWithEmailAndPassword(email, password)}>
        Sign In
      </button>
    </div>
  );
};
```
