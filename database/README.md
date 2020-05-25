# React Firebase Hooks - Realtime Database

React Firebase Hooks provides convenience listeners for lists and values stored within the
Firebase Realtime Database. The hooks wrap around the `firebase.database().ref().on()` method.

In addition to returning the list or value, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading and listening to the Realtime Database.

All hooks can be imported from `react-firebase-hooks/database`, e.g.

```
import { useList } from 'react-firebase-hooks/database';
```

List of Realtime Database hooks:

- [useList](#uselistref)
- [useListKeys](#uselistkeys)
- [useListVals](#uselistvals)
- [useObject](#useobject)
- [useObjectVal](#useobjectval)

### useList

```
const [snapshots, loading, error] = useList(reference);
```

Retrieve and monitor a list value in the Firebase Realtime Database.

The `useList` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load

Returns:

- `snapshots`: an array of `firebase.database.DataSnapshot`, or `undefined` if no reference is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firebase.FirebaseError` returned by Firebase when trying to load the data, or `undefined` if there is no error

#### Full Example

```js
import { useList } from 'react-firebase-hooks/database';

const DatabaseList = () => {
  const [snapshots, loading, error] = useList(firebase.database().ref('list'));

  return (
    <div>
      <p>
        {error && <strong>Error: {error}</strong>}
        {loading && <span>List: Loading...</span>}
        {!loading && snapshots && (
          <React.Fragment>
            <span>
              List:{' '}
              {snapshots.map((v) => (
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

### useListKeys

```
const [keys, loading, error] = useListKeys(reference);
```

As `useList`, but this hooks extracts the `firebase.database.DataSnapshot.key` values, rather than the the `firebase.database.DataSnapshot`s themselves.

The `useListKeys` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load

Returns:

- `keys`: an array of `string`, or `undefined` if no reference is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firebase.FirebaseError` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useListVals

```
const [values, loading, error] = useListVals<T>(reference, options);
```

As `useList`, but this hook extracts a typed list of the `firebase.database.DataSnapshot.val()` values, rather than the the
`firebase.database.DataSnapshot`s themselves.

The `useListVals` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `keyField`: (optional) `string` field name that should be populated with the `firebase.firestore.QuerySnapshot.id` property in the returned values

Returns:

- `values`: an array of `T`, or `undefined` if no reference is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firebase.FirebaseError` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useObject

```
const [snapshot, loading, error] = useObject(reference);
```

Retrieve and monitor an object or primitive value in the Firebase Realtime Database.

The `useObject` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load

Returns:

- `snapshot`: a `firebase.database.DataSnapshot`, or `undefined` if no reference is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firebase.FirebaseError` returned by Firebase when trying to load the data, or `undefined` if there is no error

#### Full Example

```js
import { useObject } from 'react-firebase-hooks/database';

const DatabaseValue = () => {
  const [value, loading, error] = useObject(firebase.database().ref('value'));

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

### useObjectVal

```
const [value, loading, error] = useObjectVal<T>(reference, options);
```

As `useObject`, but this hook returns the typed contents of `firebase.database.DataSnapshot.val()`, rather than the the
`firebase.database.DataSnapshot` itself.

The `useObjectVal` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `keyField`: (optional) `string` field name that should be populated with the `firebase.database.DataSnapshot.key` property in the returned value.

Returns:

- `value`: a `T`, or `undefined` if no reference is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firebase.FirebaseError` returned by Firebase when trying to load the data, or `undefined` if there is no error
