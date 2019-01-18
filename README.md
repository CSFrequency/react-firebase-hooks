# React Firebase Hooks

A set of reusable React Hooks for [Firebase](https://firebase.google.com/).

[![npm version](https://img.shields.io/npm/v/react-firebase-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-firebase-hooks)
[![npm downloads](https://img.shields.io/npm/dm/react-firebase-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-firebase-hooks)

> [Hooks](https://reactjs.org/docs/hooks-intro.html) are a new feature proposal that lets you use state and other React features without writing a class. They were first added in the React v16.7.0-alpha and are being discussed in an open RFC. They did not make it into the released v16.7.0, but are currently available in the React v16.8.0-alpha stream.

> Hooks are not currently supported in React Native - as soon as they are, we'll make sure that React Firebase Hooks works with both the Firebase JS SDK and React Native Firebase.

## Installation

React Firebase Hooks requires **React 16.7.0-alpha.0, React 16.8.0-alpha.0 or later** and **Firebase v5.0.0 or later**.

```
npm install --save react-firebase-hooks
```

This assumes that you’re using the [npm](https://npmjs.com) package manager with a module bundler like [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/) to consume [CommonJS](http://webpack.github.io/docs/commonjs.html) modules.

## Why?

It's clear that there is a **lot** of hype around React Hooks despite them still being in alpha, but this hype merely reflects that there are obvious real world benefits to React developers everywhere.

This library explores how React Hooks can work to make integration with Firebase even more straightforward than it already is. It takes inspiration for naming from RxFire and is based on an internal library that we have used in a number of apps prior to the release of React Hooks. The implementation with hooks is 10x simpler than our previous implementation.

## Documentation

### Auth

React Firebase Hooks provides a convenience listener for Firebase Auth's auth state. The hook wraps around the `firebase.auth().onAuthStateChange()` method to ensure that it is always up to date.

#### `useAuthState(auth)`

Parameters:

- `auth`: `firebase.auth.Auth`

Returns:
`AuthStateHook` containing:

- `initialising`: If the listener is still waiting for the user to be loaded
- `user`: The `firebase.User`, or `null`, if no user is logged in

Example:

```js
import { useAuthState } from 'react-firebase-hooks/auth';

const CurrentUser = () => {
  const { initialising, user } = useAuthState(firebase.auth());
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

### Cloud Firestore

React Firebase Hooks provides convenience listeners for Collections and Documents stored with
Cloud Firestore. The hooks wrap around the `firebase.firestore.collection().onSnapshot()`
and `firebase.firestore().doc().onSnapshot()` methods.

In addition to returning the snapshot value, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading and listening to Cloud Firestore.

#### `useCollection(query)`

Parameters:

- `query`: `firebase.firestore.Query`

Returns:
`CollectionHook` containing

- `error`: An optional `firebase.FirebaseError` returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A `firebase.firestore.QuerySnapshot`

Example:

```js
import { useCollection } from 'react-firebase-hooks/firestore';

const FirestoreCollection = () => {
  const { error, loading, value } = useCollection(
    firebase.firestore().collection('hooks')
  );
  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <span>
            Collection:{' '}
            {value.docs.map(doc => (
              <React.Fragment key={doc.id}>
                {JSON.stringify(doc.data())},{' '}
              </React.Fragment>
            ))}
          </span>
        )}
      </p>
    </div>
  );
};
```

#### `useDocument(docRef)`

Parameters:

- `docRef`: `firebase.firestore.DocumentReference`

Returns:
`DocumentHook` containing

- `error`: An optional `firebase.FirebaseError` returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A `firebase.firestore.DocumentSnapshot`

Example:

```js
import { useDocument } from 'react-firebase-hooks/firestore';

const FirestoreDocument = () => {
  const { error, loading, value } = useDocument(
    firebase.firestore().doc('hooks/nBShXiRGFAhuiPfBaGpt')
  );
  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Document: Loading...</span>}
        {value && <span>Document: {JSON.stringify(value.data())}</span>}
      </p>
    </div>
  );
};
```

### Realtime Database

React Firebase Hooks provides convenience listeners for lists and values stored within the
Firebase Realtime Database. The hooks wrap around the `firebase.database().ref().on()` method.

In addition to returning the list or value, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading and listening to the Realtime Database.

#### `useList(ref)`

Parameters:

- `ref`: `firebase.database.Reference`

Returns:
`ListHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A list of `firebase.database.DataSnapshot`

Example:

```js
import { useList } from 'react-firebase-hooks/database';

const DatabaseList = () => {
  const { error, list, loading } = useList(firebase.database().ref('list'));

  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>List: Loading...</span>}
        {!loading && list && (
          <React.Fragment>
            <span>
              List:{' '}
              {list.map(v => (
                <React.Fragment key={v.key}>{v.val()}, </React.Fragment>
              ))}
            </span>
          </React.Fragment>
        )}
      </p>
    </div>
  );
};
```

#### `useListKeys<T>(ref)`

As above, but this hook returns a list of the `DataSnapshot.key` values, rather than the the
`DataSnapshot`s themselves.

Parameters:

- `ref`: `firebase.database.Reference`

Returns:
`ListKeysHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A list of `firebase.database.DataSnapshot.key` values

```

#### `useListVals<T>(ref, keyField)`

Similar to `useList`, but this hook returns a typed list of the `DataSnapshot.val()` values, rather than the the
`DataSnapshot`s themselves.

Parameters:
- `ref`: `firebase.database.Reference`
- `keyField`: (Optional) Name of field that should be populated with the `DataSnapshot.key` property

Returns:
`ListValsHook` containing
- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A list of `firebase.database.DataSnapshot.val()` values, combined with the optional key field

```

#### `useObject(ref)`

Parameters:

- `ref`: `firebase.database.Reference`

Returns:
`ObjectHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A `firebase.database.DataSnapshot`

Example:

```js
import { useObject } from 'react-firebase-hooks/database';

const DatabaseValue = () => {
  const { error, loading, value } = useObject(firebase.database().ref('value'));

  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Value: Loading...</span>}
        {value && <span>Value: {value.val()}</span>}
      </p>
    </div>
  );
};
```

#### `useObjectVal<T>(ref)`

As above, but this hook returns the typed contents of `DataSnapshot.val()` rather than the
`DataSnapshot` itself.

Parameters:

- `ref`: `firebase.database.Reference`

Returns:
`ObjectValHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: The contents of `firebase.database.DataSnapshot.val()`

## License

- See [LICENSE](/LICENSE)
