# React Firebase Hooks - Cloud Firestore

React Firebase Hooks provides convenience listeners for Collections and Documents stored with Cloud Firestore. The hooks wrap around the `firestore.onSnapshot(...)` method.

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

- [React Firebase Hooks - Cloud Firestore](#react-firebase-hooks---cloud-firestore)
    - [useCollection](#usecollection)
      - [Full example](#full-example)
    - [useCollectionOnce](#usecollectiononce)
    - [useCollectionData](#usecollectiondata)
    - [useCollectionDataOnce](#usecollectiondataonce)
    - [useDocument](#usedocument)
      - [Full example](#full-example-1)
    - [useDocumentOnce](#usedocumentonce)
    - [useDocumentData](#usedocumentdata)
    - [useDocumentDataOnce](#usedocumentdataonce)
  - [Transforming data](#transforming-data)

Additional functionality:

- [Transforming data](#transforming-data)

### useCollection

```js
const [snapshot, loading, error] = useCollection(query, options);
```

Retrieve and monitor a collection value in Cloud Firestore.

Returns a `firestore.QuerySnapshot` (if a query is specified), a `boolean` to indicate if the data is still being loaded and any `firestore.FirestoreError` returned by Firebase when trying to load the data.

The `useCollection` hook takes the following parameters:

- `query`: (optional) `firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `snapshotListenOptions`: (optional) `firestore.SnapshotListenOptions` to customise how the query is loaded

Returns:

- `snapshot`: a `firestore.QuerySnapshot`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error

#### Full example

```js
import { getFirestore, collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

const FirestoreCollection = () => {
  const [value, loading, error] = useCollection(
    collection(getFirestore(firebaseApp), 'hooks'),
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

Retrieve the current value of the `firestore.Query`.

The `useCollectionOnce` hook takes the following parameters:

- `query`: (optional) `firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `Object` to customise how the collection is loaded
    - `source`: (optional): `'default' | 'server' | 'cache'` Describes whether we should get from server or cache.

Returns:

- `snapshot`: a `firestore.QuerySnapshot`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useCollectionData

```js
const [values, loading, error] = useCollectionData<T> (query, options);
```

As `useCollection`, but this hook extracts a typed list of the `firestore.QuerySnapshot.docs` values, rather than the
`firestore.QuerySnapshot` itself.

The `useCollectionData` hook takes the following parameters:

- `query`: (optional) `firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `idField`: (optional) name of the field that should be populated with the `firestore.QuerySnapshot.id` property.
  - `refField`: (optional) name of the field that should be populated with the `firestore.QuerySnapshot.ref` property.
  - `snapshotListenOptions`: (optional) `firestore.SnapshotListenOptions` to customise how the collection is loaded
  - `snapshotOptions`: (optional) `firestore.SnapshotOptions` to customise how data is retrieved from snapshots
  - `transform`: (optional) a function that receives the raw `firestore.DocumentData` for each item in the collection to allow manual transformation of the data where required by the application. See [`Transforming data`](#transforming-data) below.

Returns:

- `values`: an array of `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useCollectionDataOnce

```js
const [values, loading, error] = useCollectionDataOnce<T>(query, options);
```

As `useCollectionData`, but this hook will only read the current value of the `firestore.Query`.

The `useCollectionDataOnce` hook takes the following parameters:

- `query`: (optional) `firestore.Query` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `Object` to customise how the collection is loaded
    - `source`: (optional): `'default' | 'server' | 'cache'` Describes whether we should get from server or cache.
  - `idField`: (optional) name of the field that should be populated with the `firestore.QuerySnapshot.id` property.
  - `refField`: (optional) name of the field that should be populated with the `firestore.QuerySnapshot.ref` property.
  - `snapshotOptions`: (optional) `firestore.SnapshotOptions` to customise how data is retrieved from snapshots
  - `transform`: (optional) a function that receives the raw `firestore.DocumentData` for each item in the collection to allow manual transformation of the data where required by the application. See [`Transforming data`](#transforming-data) below.

Returns:

- `values`: an array of `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useDocument

```js
const [snapshot, loading, error] = useDocument(reference, options);
```

Retrieve and monitor a document value in Cloud Firestore.

The `useDocument` hook takes the following parameters:

- `reference`: (optional) `firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `snapshotListenOptions`: (optional) `firestore.SnapshotListenOptions` to customise how the query is loaded

Returns:

- `snapshot`: a `firestore.DocumentSnapshot`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error

#### Full example

```js
import { getFirestore, doc } from 'firebase/firestore';
import { useDocument } from 'react-firebase-hooks/firestore';

const FirestoreDocument = () => {
  const [value, loading, error] = useDocument(
    doc(getFirestore(firebaseApp, 'hooks', 'nBShXiRGFAhuiPfBaGpt')),
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

Retrieve the current value of the `firestore.DocumentReference`.

The `useDocumentOnce` hook takes the following parameters:

- `reference`: (optional) `firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `Object` to customise how the collection is loaded
    - `source`: (optional): `'default' | 'server' | 'cache'` Describes whether we should get from server or cache.

Returns:

- `snapshot`: a `firestore.DocumentSnapshot`, or `undefined` if no reference is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useDocumentData

```js
const [value, loading, error] = useDocumentData<T>(reference, options);
```

As `useDocument`, but this hook extracts the typed contents of `firestore.DocumentSnapshot.data()`, rather than the
`firestore.DocumentSnapshot` itself.

The `useDocumentData` hook takes the following parameters:

- `reference`: (optional) `firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `idField`: (optional) name of the field that should be populated with the `firestore.DocumentSnapshot.id` property.
  - `refField`: (optional) name of the field that should be populated with the `firestore.QuerySnapshot.ref` property.
  - `snapshotListenOptions`: (optional) `firestore.SnapshotListenOptions` to customise how the collection is loaded
  - `snapshotOptions`: (optional) `firestore.SnapshotOptions` to customise how data is retrieved from snapshots
  - `transform`: (optional) a function that receives the raw `firestore.DocumentData` to allow manual transformation of the data where required by the application. See [`Transforming data`](#transforming-data) below.

Returns:

- `value`: `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error

### useDocumentDataOnce

```js
const [value, loading, error] = useDocumentDataOnce<T> (reference, options);
```

As `useDocument`, but this hook will only read the current value of the `firestore.DocumentReference`.

The `useDocumentDataOnce` hook takes the following parameters:

- `reference`: (optional) `firestore.DocumentReference` for the data you would like to load
- `options`: (optional) `Object` with the following parameters:
  - `getOptions`: (optional) `Object` to customise how the collection is loaded
    - `source`: (optional): `'default' | 'server' | 'cache'` Describes whether we should get from server or cache.
  - `idField`: (optional) name of the field that should be populated with the `firestore.DocumentSnapshot.id` property.
  - `refField`: (optional) name of the field that should be populated with the `firestore.QuerySnapshot.ref` property.
  - `snapshotOptions`: (optional) `firestore.SnapshotOptions` to customise how data is retrieved from snapshots
  - `transform`: (optional) a function that receives the raw `firestore.DocumentData` to allow manual transformation of the data where required by the application. See [`Transforming data`](#transforming-data) below.

Returns:

- `value`: `T`, or `undefined` if no query is supplied
- `loading`: a `boolean` to indicate if the data is still being loaded
- `error`: Any `firestore.FirestoreError` returned by Firebase when trying to load the data, or `undefined` if there is no error

## Transforming data

Firestore allows a restricted number of data types in its store, which may not be flexible enough for your application. Both `useCollectionData` and `useDocumentData` support an optional `transform` function which allows the transformation of the underlying Firestore data into whatever format the application requires, e.g. a `Date` type.

```js
transform?: (val: any) => T;
```

The `transform` function is passed a single row of a data, so will be called once when used with `useDocumentData` and multiple times when used with `useCollectionData`.

The `transform` function will not receive the `id` or `ref` values referenced in the properties named in the `idField` or `refField` options, nor it is expected to produce them. Either or both, if specified, will be merged afterwards.

If the `transform` function is defined within your React component, it is recomended that you memoize the function to prevent unnecessry renders.
