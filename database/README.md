# React Firebase Hooks - Realtime Database

React Firebase Hooks provides convenience listeners for lists and values stored within the
Firebase Realtime Database. The hooks wrap around the `firebase.database().ref().on()` method.

In addition to returning the list or value, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading and listening to the Realtime Database.

All hooks can be imported from `react-firebase-hooks/database`, e.g.

```js
import { useList } from 'react-firebase-hooks/database';
```

List of Realtime Database hooks:

- [useList](#uselist)
- [useListKeys](#uselistkeys)
- [useListVals](#uselistvals)
- [useObject](#useobject)
- [useObjectVal](#useobjectval)
- [transform option](#transform-option)

### useList

```js
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

```js
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

```js
const [values, loading, error] = useListVals < T > (reference, options);
```

As `useList`, but this hook extracts a typed list of the `firebase.database.DataSnapshot.val()` values, rather than the the
`firebase.database.DataSnapshot`s themselves.

The `useListVals` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `keyField`: (optional) `string` field name that should be populated with the `firebase.database.DataSnapshot.id` property in the returned values.
  - `refField`: (optional) `string` field name that should be populated with the `firebase.database.DataSnapshot.ref` property.
  - `transform`: (optional) a function that will receive the raw value for each row from the `firebase.database.DataSnapshot.val()` method and converts any fields from the restricted types that Firebase allows to whatever is required by the application.  See [`transform`](#transform-option) below.

Returns:

- `values`: an array of `T`, or `undefined` if no reference is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firebase.FirebaseError` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useObject

```js
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

```js
const [value, loading, error] = useObjectVal < T > (reference, options);
```

As `useObject`, but this hook returns the typed contents of `firebase.database.DataSnapshot.val()`, rather than the the
`firebase.database.DataSnapshot` itself.

The `useObjectVal` hook takes the following parameters:

- `reference`: (optional) `firebase.database.Reference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `keyField`: (optional) `string` field name that should be populated with the `firebase.database.DataSnapshot.key` property in the returned value.
  - `refField`: (optional) `string` field name that should be populated with the `firebase.database.DataSnapshot.ref` property.
  - `transform`: (optional) a function that will receive the raw value from the `firebase.database.DataSnapshot.val()` method and converts any fields from the restricted types that Firebase allows to whatever it is required by the application. See [`transform`](#transform-option) below.


Returns:

- `value`: a `T`, or `undefined` if no reference is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firebase.FirebaseError` returned by Firebase when trying to load the data, or `undefined` if there is no error

### transform option

Firebase allows a restricted number of data types in its store.  The application, on the other hand, might require converting some of these types into whatever it really needs, `Date` types being a common case.

```js
transform?: (arg: any) => T;
```

Used as an option in both `useListVals` and `useObjectVal`, the `transform` function takes the values as stored in a Firebase database row and converts it to the data types expected by the application.  No changes will occur to the data if this option is omitted.

The `transform` function needs to deal with just one row at a time.  It will be called once when used with `useObjectVal` and multiple times, once per row, when used with `useListVals` so the same function can be used in both.

The `transform` function will not receive the `id` or `ref` values referenced in the properties named in the `keyField` or `refField` options, nor it is expected to produce them.  Either or both, if specified, will be merged afterwards.


#### Full Example

```js
type SaleType = {
  idSale: string;
  date: Date; // <== it is declared as type Date which Firebase does not support.
  // ...Other fields
}

const options = {
  keyField: 'idSale',
  transform: (val) => ({
    ...val,
    date: new Date(val.date),
  }),
};

export const useSale: (
  idSale: string
) => [SaleType | undefined, boolean, any] = (idSale) =>
  useObjectVal<SaleType>(database.ref(`sales/${idSale}`), options);

export const useSales: () => [
  SaleType[] | undefined,
  boolean,
  any
] = () =>
  useListVals<SaleType>(database.ref('sales'), options);
```

The `transform` function might be used for various purposes:

```js
transform: ({firstName, lastName, someBool, ...val}) => ({
    // Merge in default values, declared elsewhere:
    ...defaultValues,

    // Override them with the actual values
    ...val,

    // Create new fields from existing values
    fullName: `${firstName} ${lastName}`,

    // Ensure a field is a proper boolean instead of truish or falsy:
    someBool: !!someBool,

    // Same goes for any other poorly represented data type
  });
```