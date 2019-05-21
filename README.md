# React Firebase Hooks - v1

A set of reusable React Hooks for [Firebase](https://firebase.google.com/).

[![npm version](https://img.shields.io/npm/v/react-firebase-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-firebase-hooks)
[![npm downloads](https://img.shields.io/npm/dm/react-firebase-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-firebase-hooks)

> [Hooks](https://reactjs.org/docs/hooks-intro.html) are a new feature that lets you use state and other React features without writing a class and are available in React v16.8.0 or later.

> Official support for Hooks was added to React Native in v0.59.0. React Firebase Hooks works with both the Firebase JS SDK and React Native Firebase, although some of the Flow and Typescript typings may be incorrect - we are investigating ways to improve this for React Native users.

**This documentation is for v1 of React Firebase Hooks which is an old version. If you'd like to switch to v2, check out the [Release Notes](https://github.com/CSFrequency/react-firebase-hooks/releases/tag/v2.0.0) and [Updated Documentation](https://github.com/CSFrequency/react-firebase-hooks).**

## Installation

React Firebase Hooks requires **React 16.8.0 or later** and **Firebase v5.0.0 or later**.

```
npm install --save react-firebase-hooks@1.2.1
```

This assumes that you’re using the [npm](https://npmjs.com) package manager with a module bundler like [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/) to consume [CommonJS](http://webpack.github.io/docs/commonjs.html) modules.

## Why?

There has been a **lot** of hype around React Hooks, but this hype merely reflects that there are obvious real world benefits of Hooks to React developers everywhere.

This library explores how React Hooks can work to make integration with Firebase even more straightforward than it already is. It takes inspiration for naming from RxFire and is based on an internal library that we had been using in a number of apps prior to the release of React Hooks. The implementation with hooks is 10x simpler than our previous implementation.

## Documentation

- [Auth Hooks](#Auth)
- [Cloud Firestore Hooks](#cloud-firestore)
- [Cloud Storage Hooks](#cloud-storage)
- [Realtime Database Hooks](#realtime-database)

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

There are 2 variants of each hook:

- `useX` which subscribes to the underlying Collection or Document and listens for changes
- `useXOnce` which reads the current value of the Collection or Document

#### `useCollection(query, options)`

Parameters:

- `query`: `firebase.firestore.Query`
- `options`: `firebase.firestore.SnapshotListenOptions`

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

#### `useCollectionOnce(query, options)`

Parameters:

- `query`: `firebase.firestore.Query`
- `options`: `firebase.firestore.GetOptions`

Returns:
`CollectionHook` containing

- `error`: An optional `firebase.FirebaseError` returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A `firebase.firestore.QuerySnapshot`

Import:

```js
import { useCollectionOnce } from 'react-firebase-hooks/firestore';
```

#### `useCollectionData<T>(ref, idField)`

As `useCollection`, but this hook returns a typed list of the
`QuerySnapshot.docs` values, rather than the the `QuerySnapshot` itself.

Parameters:

- `query`: `firebase.firestore.Query`
- `options`: (Optional) `firebase.firestore.GetOptions`
- `idField`: (Optional) Name of field that should be populated with the `QuerySnapshot.id` property

Returns:
`CollectionDataHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A list of `firebase.firestore.DocumentSnapshot.data()` values, combined with the optional id field

Import:

```js
import { useCollectionData } from 'react-firebase-hooks/firestore';
```

#### `useDocument(docRef)`

Parameters:

- `docRef`: `firebase.firestore.DocumentReference`
- `options`: (Optional) `firebase.firestore.SnapshotListenOptions`

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

#### `useDocumentOnce(docRef)`

Parameters:

- `docRef`: `firebase.firestore.DocumentReference`
- `options`: (Optional) `firebase.firestore.GetOptions`

Returns:
`DocumentHook` containing

- `error`: An optional `firebase.FirebaseError` returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A `firebase.firestore.DocumentSnapshot`

Import:

```js
import { useDocumentOnce } from 'react-firebase-hooks/firestore';
```

#### `useDocumentData<T>(ref)`

As `useDocument`, but this hook returns the typed contents of
`DocumentSnapshot.val()` rather than the `DocumentSnapshot` itself.

Parameters:

- `docRef`: `firebase.firestore.DocumentReference`
- `options`: (Optional) `firebase.firestore.SnapshotListenOptions`
- `idField`: (Optional) Name of field that should be populated with the `DocumentSnapshot.id` property

Returns:
`DocumentDataHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: The contents of `firebase.firestore.DocumentSnapshot.data()`, combined with the optional id field

Import:

```js
import { useDocumentData } from 'react-firebase-hooks/firestore';
```

#### `useDocumentDataOnce<T>(ref)`

Parameters:

- `docRef`: `firebase.firestore.DocumentReference`
- `options`: (Optional) `firebase.firestore.GetOptions`
- `idField`: (Optional) Name of field that should be populated with the `DocumentSnapshot.id` property

Returns:
`DocumentDataHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: The contents of `firebase.firestore.DocumentSnapshot.data()`, combined with the optional id field

Import:

```js
import { useDocumentDataOnce } from 'react-firebase-hooks/firestore';
```

### Cloud Storage

React Firebase Hooks provides convenience listeners for files stored within
Firebase Cloud Storage. The hooks wrap around the `firebase.storage().ref().getDownloadURL()` method.

In addition to returning the download URL, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading from Cloud Storage.

#### `useDownloadURL(ref)`

Parameters:

- `ref`: `firebase.storage.Reference`

Returns:
`DownloadURLHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the download URL is still being loaded
- `value`: The download URL

Example:

```js
import { useDownloadURL } from 'react-firebase-hooks/storage';

const DownloadURL = () => {
  const { error, loading, value } = useDownloadURL(
    firebase.storage().ref('path/to/file')
  );

  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>Download URL: Loading...</span>}
        {!loading && value && (
          <React.Fragment>
            <span>Download URL: {value}</span>
          </React.Fragment>
        )}
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
  const { error, loading, value } = useList(firebase.database().ref('list'));

  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>List: Loading...</span>}
        {!loading && value && (
          <React.Fragment>
            <span>
              List:{' '}
              {value.map(v => (
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
- `keyField`: (Optional) Name of field that should be populated with the `DataSnapshot.key` property

Returns:
`ObjectValHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: The contents of `firebase.database.DataSnapshot.val()`, combined with the optional key field

## License

- See [LICENSE](/LICENSE)
