# React Firebase Hooks - Cloud Storage

React Firebase Hooks provides convenience listeners for files stored within
Firebase Cloud Storage. The hooks wrap around the `firebase.storage().ref().getDownloadURL()` method.

In addition to returning the download URL, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading from Cloud Storage.

All hooks can be imported from `react-firebase-hooks/storage`, e.g.

```
import { useCollection } from 'react-firebase-hooks/storage';
```

List of Cloud Storage hooks:

- [useDownloadURL](#usedownloadurl)

### useDownloadURL

```
const [downloadUrl, loading, error] = useDownloadURL(reference);
```

Returns the download URL as a `string` (if a reference is supplied), a boolean to indicate whether the the download URL is still being loaded and any `firebase.FirebaseError` returned by Firebase when trying to load the download URL.

The `useDownloadURL` hook takes the following parameters:

- `reference`: (optional) `firebase.storage.Reference` that you would like the download URL for

#### Full example

```js
import { useDownloadURL } from 'react-firebase-hooks/storage';

const DownloadURL = () => {
  const [value, loading, error] = useDownloadURL(
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
