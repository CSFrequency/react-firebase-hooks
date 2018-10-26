# React Firebase Hooks

[React Hooks](https://reactjs.org/docs/hooks-intro.html) for [Firebase](https://firebase.google.com/).

**NOTE: Both React's support for hooks and React Firebase Hooks are a work in progress**

## Installation

React Firebase Hooks requires **React 16.7.0-alpha.0 or later** and **Firebase v5.0.0 or later**.

```
npm install --save react-firebase-hooks
```

This assumes that you’re using the [npm](https://npmjs.com) package manager with a module bundler like [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/) to consume [CommonJS](http://webpack.github.io/docs/commonjs.html) modules.

## React Native

React Hooks are not currently supported in React Native.  As soon as they are, support will be added for use with both the Firebase JS SDK and React Native Firebase.

## Documentation

### Auth

React Firebase Hooks provides a convenience listeners for Firebase Auth's current user. The hook wraps around the `firebase.auth().onAuthStateChange()` method to ensure that it is always up to date.

#### `useCurrentUser()`

Returns:
`CurrentUser` containing:
- `initialising`: If the listener is still waiting for the user to be loaded
- `user`: The `firebase.User`, or `null`, if no user is logged in

Example:

```js
import { useCurrentUser } from 'react-firebase-hooks';

const CurrentUser = () => {
  const { initialising, user } = useCurrentUser();
  const login = () => {
    firebase.auth().signInWithEmailAndPassword('test@test.com', 'password');
  };
  const logout = () => { firebase.auth().signOut(); };

  if (initialising) {
    return (
      <div>
        <p>Initialising User...</p>
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
  return (
    <button onClick={login}>Log in</button>
  )
};

```

### Realtime Database

React Firebase Hooks provides convenience listeners for lists and values stored within the
Firebase Realtime Database.  The hooks wrap around the `firebase.database().ref().on()` method.

In addition to returning the list or value, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading and listening to the Realtime Database.

#### `useDatabaseList(pathOrRef)`

Parameters:
- `pathOrRef`: `string` | `firebase.database.Reference`

Returns:
`DatabaseList` containing
- `error`: An optional error object returned by Firebase
- `list`: A list of `firebase.database.DataSnapshot`
- `loading`: A `boolean` to indicate if the listener is still being loaded

Example:
```js
import { useDatabaseList } from 'react-firebase-hooks';

const DatabaseList = () => {
  const { error, list, loading } = useDatabaseList('list');

  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Loading List...</span>}
        {!loading && list && (
          <React.Fragment>
            <p>List:</p>
            {list.map(v => <React.Fragment>{v}, </React.Fragment>)}
          </React.Fragment>
        )}
      </p>
    </div>
  );
};
```

#### `useDatabaseValue(pathOrRef)`

Parameters:
- `pathOrRef`: `string` | `firebase.database.Reference`

Returns:
`DatabaseValue` containing
- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A `firebase.database.DataSnapshot`

Example:
```js
import { useDatabaseValue } from 'react-firebase-hooks';

const DatabaseValue = () => {
  const { error, loading, value } = useDatabaseValue('value');

  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Loading Value...</span>}
        {value && <span>Value: {value}</span>}
      </p>
    </div>
  );
};

```

### Firestore

Coming soon.

## License

* See [LICENSE](/LICENSE)
