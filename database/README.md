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
- [useListKeys](#uselistkeyst)
- [useListVals](#uselistvals)
- [useObject](#useobjectref)
- [useObjectVal](#useobjectval)

### useList

```
const [snapshots, loading, error] = useList(reference);
```

Returns an array of `firebase.database.DataSnapshot` (if a reference is specified), a `boolean` to indicate if the data is still being loaded and any `firebase.FirebaseError` returned by Firebase when trying to load the data.

The `useList` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load

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

### useListKeys

```
const [keys, loading, error] = useListKeys(reference);
```

As `useList`, but this hook returns a list of the `firebase.database.DataSnapshot.key` values, rather than the the `firebase.database.DataSnapshot`s themselves.

The `useListKeys` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load

### useListVals

```
const [values, loading, error] = useListVals<T>(reference, keyField);
```

As `useList`, but this hook returns a typed list of the `firebase.database.DataSnapshot.val()` values, rather than the the
`DataSnapshot`s themselves.

The `useListVals` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load
- `keyField`: (optional) `string` field name that should be populated with the `firebase.database.DataSnapshot.key` property in the returned value.

### useObject

```
const [snapshot, loading, error] = useObject(reference);
```

Returns a `firebase.database.DataSnapshot` (if a reference is specified), a `boolean` to indicate if the data is still being loaded and any `firebase.FirebaseError` returned by Firebase when trying to load the data.

The `useObject` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load

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
const [value, loading, error] = useObjectVal<T>(reference, keyField);
```

As `useObject`, but this hook returns the typed contents of `DataSnapshot.val()` rather than the
`DataSnapshot` itself.

The `useObjectVal` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load
- `keyField`: (optional) `string` field name that should be populated with the `firebase.database.DataSnapshot.key` property in the returned value.
