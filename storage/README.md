# React Firebase Hooks - Cloud Storage

React Firebase Hooks provides convenience listeners for files stored within
Firebase Cloud Storage. The hooks wrap around the `getDownloadURL(...)` method.

In addition to returning the download URL, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading from Cloud Storage.

All hooks can be imported from `react-firebase-hooks/storage`, e.g.

```js
import { useDownloadURL } from 'react-firebase-hooks/storage';
```

List of Cloud Storage hooks:

- [useDownloadURL](#usedownloadurl)

### useDownloadURL

```js
const [downloadUrl, loading, error] = useDownloadURL(reference);
```

Retrieve the download URL for a storage reference.

The `useDownloadURL` hook takes the following parameters:

- `reference`: (optional) `storage.Reference` that you would like the download URL for

Returns:

- `downloadUrl`: A `string` download URL, or `undefined` if no storage reference is supplied
- `loading`: A `boolean` to indicate whether the the download URL is still being loaded
- `error`: Any `storage.StorageError` returned by Firebase when trying to load the user, or `undefined` if there is no error

#### Full example

```js
import { ref, getStorage } from 'firebase/storage';
import { useDownloadURL } from 'react-firebase-hooks/storage';

const storage = getStorage(firebaseApp);

const DownloadURL = () => {
  const [value, loading, error] = useDownloadURL(
    ref(storage, 'path/to/file')
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
