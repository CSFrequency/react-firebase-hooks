# React Firebase Hooks - Cloud Firestore

React Firebase Hooks provides convenience listeners for Collections and Documents stored with
Cloud Firestore. The hooks wrap around the `firebase.firestore.collection().onSnapshot()`
and `firebase.firestore().doc().onSnapshot()` methods.

In addition to returning the snapshot value, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading and listening to Cloud Firestore.

There are 2 variants of each hook:

- `useX` which subscribes to the underlying Collection or Document and listens for changes
- `useXOnce` which reads the current value of the Collection or Document

All hooks can be imported from `react-firebase-hooks/firestore`, e.g.

```js
import { useCollection } from 'react-firebase-hooks/firestore';
```

List of Cloud Firestore hooks:

- [useCollection](#usecollection)
- [useCollectionOnce](#usecollectiononce)
- [useCollectionData](#usecollectiondata)
- [useCollectionDataOnce](#usecollectiondataonce)
- [useDocument](#usedocument)
- [useDocumentOnce](#usedocumentonce)
- [useDocumentData](#usedocumentdata)
- [useDocumentDataOnce](#usedocumentdataonce)

Additional functionality:

- [Transforming data](#transforming-data)

### useCollection

```js
const [snapshot, loading, error] = useCollection(query, options);
```

Retrieve and monitor a collection value in Cloud Firestore.

Returns a `firebase.firestore.QuerySnapshot` (if a query is specified), a `boolean` to indicate if the data is still being loaded and any `Error` returned by Firebase when trying to load the data.

The `useCollection` hook takes the following parameters:

- `query`: (optional) `firebase.firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `snapshotListenOptions`: (optional) `firebase.firestore.SnapshotListenOptions` to customise how the query is loaded

Returns:

- `snapshot`: a `firebase.firestore.QuerySnapshot`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `Error` returned by Firebase when trying to load the data, or `undefined` if there is no error

#### Full example

```js
import { useCollection } from 'react-firebase-hooks/firestore';

const FirestoreCollection = () => {
  const [value, loading, error] = useCollection(
    firebase.firestore().collection('hooks'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div>
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {value && (
          <span>
            Collection:{' '}
            {value.docs.map((doc) => (
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

### useCollectionOnce

```js
const [snapshot, loading, error] = useCollectionOnce(query, options);
```

Retrieve the current value of the `firebase.firestore.Query`.

The `useCollectionOnce` hook takes the following parameters:

- `query`: (optional) `firebase.firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `firebase.firestore.GetOptions` to customise how the collection is loaded

Returns:

- `snapshot`: a `firebase.firestore.QuerySnapshot`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `Error` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useCollectionData

```js
const [values, loading, error] = useCollectionData < T > (query, options);
```

As `useCollection`, but this hook extracts a typed list of the `firebase.firestore.QuerySnapshot.docs` values, rather than the
`firebase.firestore.QuerySnapshot` itself.

The `useCollectionData` hook takes the following parameters:

- `query`: (optional) `firebase.firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `idField`: (optional) name of the field that should be populated with the `firebase.firestore.QuerySnapshot.id` property.
  - `refField`: (optional) name of the field that should be populated with the `firebase.firestore.QuerySnapshot.ref` property.
  - `snapshotListenOptions`: (optional) `firebase.firestore.SnapshotListenOptions` to customise how the collection is loaded
  - `snapshotOptions`: (optional) `firebase.firestore.SnapshotOptions` to customise how data is retrieved from snapshots
  - `transform`: (optional) a function that receives the raw `firebase.firestore.DocumentData` for each item in the collection to allow manual transformation of the data where required by the application. See [`Transforming data`](#transforming-data) below.
  - `initialValue`: (optional) the initial value returned by the hook, until data from the firestore query has loaded

Returns:

- `values`: an array of `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `Error` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useCollectionDataOnce

```js
const [values, loading, error] = useCollectionDataOnce < T > (query, options);
```

As `useCollectionData`, but this hook will only read the current value of the `firebase.firestore.Query`.

The `useCollectionDataOnce` hook takes the following parameters:

- `query`: (optional) `firebase.firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `firebase.firestore.GetOptions` to customise how the collection is loaded
  - `idField`: (optional) name of the field that should be populated with the `firebase.firestore.QuerySnapshot.id` property.
  - `refField`: (optional) name of the field that should be populated with the `firebase.firestore.QuerySnapshot.ref` property.
  - `snapshotOptions`: (optional) `firebase.firestore.SnapshotOptions` to customise how data is retrieved from snapshots
  - `transform`: (optional) a function that receives the raw `firebase.firestore.DocumentData` for each item in the collection to allow manual transformation of the data where required by the application. See [`Transforming data`](#transforming-data) below.
  - `initialValue`: (optional) the initial value returned by the hook, until data from the firestore query has loaded

Returns:

- `values`: an array of `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `Error` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useDocument

```js
const [snapshot, loading, error] = useDocument(reference, options);
```

Retrieve and monitor a document value in Cloud Firestore.

The `useDocument` hook takes the following parameters:

- `reference`: (optional) `firebase.firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `snapshotListenOptions`: (optional) `firebase.firestore.SnapshotListenOptions` to customise how the query is loaded

Returns:

- `snapshot`: a `firebase.firestore.DocumentSnapshot`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `Error` returned by Firebase when trying to load the data, or `undefined` if there is no error

#### Full example

```js
import { useDocument } from 'react-firebase-hooks/firestore';

const FirestoreDocument = () => {
  const [value, loading, error] = useDocument(
    firebase.firestore().doc('hooks/nBShXiRGFAhuiPfBaGpt'),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  return (
    <div>
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Document: Loading...</span>}
        {value && <span>Document: {JSON.stringify(value.data())}</span>}
      </p>
    </div>
  );
};
```

### useDocumentOnce

```js
const [snapshot, loading, error] = useDocumentOnce(reference, options);
```

Retrieve the current value of the `firebase.firestore.DocumentReference`.

The `useDocumentOnce` hook takes the following parameters:

- `reference`: (optional) `firebase.firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `firebase.firestore.GetOptions` to customise how the collection is loaded

Returns:

- `snapshot`: a `firebase.firestore.DocumentSnapshot`, or `undefined` if no reference is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `Error` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useDocumentData

```js
const [value, loading, error] = useDocumentData < T > (reference, options);
```

As `useDocument`, but this hook extracts the typed contents of `firebase.firestore.DocumentSnapshot.val()`, rather than the
`firebase.firestore.DocumentSnapshot` itself.

The `useDocumentData` hook takes the following parameters:

- `reference`: (optional) `firebase.firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `idField`: (optional) name of the field that should be populated with the `firebase.firestore.DocumentSnapshot.id` property.
  - `refField`: (optional) name of the field that should be populated with the `firebase.firestore.QuerySnapshot.ref` property.
  - `snapshotListenOptions`: (optional) `firebase.firestore.SnapshotListenOptions` to customise how the collection is loaded
  - `snapshotOptions`: (optional) `firebase.firestore.SnapshotOptions` to customise how data is retrieved from snapshots
  - `transform`: (optional) a function that receives the raw `firebase.firestore.DocumentData` to allow manual transformation of the data where required by the application. See [`Transforming data`](#transforming-data) below.
  - `initialValue`: (optional) the initial value returned by the hook, until data from the firestore query has loaded

Returns:

- `value`: `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `Error` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useDocumentDataOnce

```js
const [value, loading, error] = useDocumentDataOnce < T > (reference, options);
```

As `useDocument`, but this hook will only read the current value of the `firebase.firestore.DocumentReference`.

The `useDocumentDataOnce` hook takes the following parameters:

- `reference`: (optional) `firebase.firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `firebase.firestore.GetOptions` to customise how the collection is loaded
  - `idField`: (optional) name of the field that should be populated with the `firebase.firestore.DocumentSnapshot.id` property.
  - `refField`: (optional) name of the field that should be populated with the `firebase.firestore.QuerySnapshot.ref` property.
  - `snapshotOptions`: (optional) `firebase.firestore.SnapshotOptions` to customise how data is retrieved from snapshots
  - `transform`: (optional) a function that receives the raw `firebase.firestore.DocumentData` to allow manual transformation of the data where required by the application. See [`Transforming data`](#transforming-data) below.
  - `initialValue`: (optional) the initial value returned by the hook, until data from the firestore query has loaded

Returns:

- `value`: `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `Error` returned by Firebase when trying to load the data, or `undefined` if there is no error

## Transforming data

Firestore allows a restricted number of data types in its store, which may not be flexible enough for your application. Both `useCollectionData` and `useDocumentData` support an optional `transform` function which allows the transformation of the underlying Firestore data into whatever format the application requires, e.g. a `Date` type.

```js
transform?: (val: any) => T;
```

The `transform` function is passed a single row of a data, so will be called once when used with `useDocumentData` and multiple times when used with `useCollectionData`.

The `transform` function will not receive the `id` or `ref` values referenced in the properties named in the `idField` or `refField` options, nor it is expected to produce them. Either or both, if specified, will be merged afterwards.

If the `transform` function is defined within your React component, it is recomended that you memoize the function to prevent unnecessry renders.
