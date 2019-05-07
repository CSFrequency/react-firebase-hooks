# React Firebase Hooks - Realtime Database

React Firebase Hooks provides convenience listeners for lists and values stored within the
Firebase Realtime Database. The hooks wrap around the `firebase.database().ref().on()` method.

In addition to returning the list or value, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading and listening to the Realtime Database.

List of Realtime Database hooks:

- [useList](#uselistref)
- [useListKeys](#uselistkeystref)
- [useListVals](#uselistvalstref-keyfield)
- [useObject](#useobjectref)
- [useObjectVal](#useobjectvaltref)

### `useList(ref)`

Parameters:

- `ref`: `firebase.database.Reference`

Returns:
`ListHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A list of `firebase.database.DataSnapshot`

#### Example

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

### `useListKeys<T>(ref)`

As above, but this hook returns a list of the `DataSnapshot.key` values, rather than the the
`DataSnapshot`s themselves.

Parameters:

- `ref`: `firebase.database.Reference`

Returns:
`ListKeysHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A list of `firebase.database.DataSnapshot.key` values

### `useListVals<T>(ref, keyField)`

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

### `useObject(ref)`

Parameters:

- `ref`: `firebase.database.Reference`

Returns:
`ObjectHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A `firebase.database.DataSnapshot`

#### Example

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

### `useObjectVal<T>(ref)`

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
