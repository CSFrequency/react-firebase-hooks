# Cloud Storage

React Firebase Hooks provides convenience listeners for files stored within
Firebase Cloud Storage. The hooks wrap around the `firebase.storage().ref().getDownloadURL()` method.

In addition to returning the download URL, the hooks provide an `error` and `loading` property
to give a complete lifecycle for loading from Cloud Storage.

- [useDownloadURL](#usedownloadurlref)

## `useDownloadURL(ref)`

Parameters:

- `ref`: `firebase.storage.Reference`

Returns:
`DownloadURLHook` containing

- `error`: An optional error object returned by Firebase
- `loading`: A `boolean` to indicate if the download URL is still being loaded
- `value`: The download URL

### Example

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
