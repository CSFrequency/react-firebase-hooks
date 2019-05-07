# React Firebase Hooks - Cloud Firestore

React Firebase Hooks provides convenience listeners for Collections and Documents stored with
Cloud Firestore. The hooks wrap around the `firebase.firestore.collection().onSnapshot()`
and `firebase.firestore().doc().onSnapshot()` methods.

In addition to returning the snapshot value, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading and listening to Cloud Firestore.

There are 2 variants of each hook:

- `useX` which subscribes to the underlying Collection or Document and listens for changes
- `useXOnce` which reads the current value of the Collection or Document

- [useCollection](#usecollectionquery-options)
- [useCollectionOnce](#usecollectiononcequery-options)
- [useCollectionData](#usecollectiondatatref-idfield)
- [useCollectionDataOnce](#usecollectiondataoncetref-idfield)
- [useDocument](#usedocumentdocref)
- [useDocumentOnce](#usedocumentoncedocref)
- [useDocumentData](#usedocumentdatatref)
- [useDocumentDataOnce](#usedocumentdataoncetref)

## `useCollection(query, options)`

Parameters:

- `query`: `firebase.firestore.Query`
- `options`: `firebase.firestore.SnapshotListenOptions`

Returns:
`CollectionHook` containing

- `error`: An optional `firebase.FirebaseError` returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A `firebase.firestore.QuerySnapshot`

### Example

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

## `useCollectionOnce(query, options)`

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

## `useCollectionData<T>(ref, idField)`

As `useCollection`, but this hook returns a typed list of the
`QuerySnapshot.docs` values, rather than the the `QuerySnapshot` itself.

Parameters:

- `query`: `firebase.firestore.Query`
- `options`: (Optional) Object containing:
  - `snapshotListenOptions`: (Optional) `firebase.firestore.SnapshotListenOptions`
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

## `useCollectionDataOnce<T>(ref, idField)`

Parameters:

- `query`: `firebase.firestore.Query`
- `options`: (Optional) Object containing:
  - `getOptions`: (Optional) `firebase.firestore.GetOptions`
  - `idField`: (Optional) Name of field that should be populated with the `QuerySnapshot.id` property

Returns:
`CollectionDataHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A list of `firebase.firestore.DocumentSnapshot.data()` values, combined with the optional id field

Import:

```js
import { useCollectionDataOnce } from 'react-firebase-hooks/firestore';
```

## `useDocument(docRef)`

Parameters:

- `docRef`: `firebase.firestore.DocumentReference`
- `options`: (Optional) `firebase.firestore.SnapshotListenOptions`

Returns:
`DocumentHook` containing

- `error`: An optional `firebase.FirebaseError` returned by Firebase
- `loading`: A `boolean` to indicate if the listener is still being loaded
- `value`: A `firebase.firestore.DocumentSnapshot`

### Example

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

## `useDocumentOnce(docRef)`

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

## `useDocumentData<T>(ref)`

As `useDocument`, but this hook returns the typed contents of
`DocumentSnapshot.val()` rather than the `DocumentSnapshot` itself.

Parameters:

- `docRef`: `firebase.firestore.DocumentReference`
- `options`: (Optional) Object containing:
  - `snapshotListenOptions`: (Optional) `firebase.firestore.SnapshotListenOptions`
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

## `useDocumentDataOnce<T>(ref)`

Parameters:

- `docRef`: `firebase.firestore.DocumentReference`
- `options`: (Optional) Object containing:
  - `getOptions`: (Optional) `firebase.firestore.GetOptions`
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
