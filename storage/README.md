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
- [useUploadFile](#useuploadfile)

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
- `error`: Any `storage.StorageError` returned by Firebase when trying to load the URL, or `undefined` if there is no error

#### Full example

```js
import { getStorage, storageRef } from 'firebase/storage';
import { useDownloadURL } from 'react-firebase-hooks/storage';

const storage = getStorage(firebaseApp);

const DownloadURL = () => {
  const [value, loading, error] = useDownloadURL(ref(storage, 'path/to/file'));

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

### useUploadFile

```js
const [uploadFile, uploading, snapshot, error] = useUploadFile();
```

Upload a file to Firebase storage.

The `useUploadFile` hook returns the following:

- `uploadFile(ref, file, metadata)`: A function that can be called to upload a file, with attached metadata, to the storage reference supplied
- `uploading`: A `boolean` to indicate whether the the file is currently being uploaded
- `snapshot`: A `storage.UploadTaskSnapshot` to provide more detailed information about the upload
- `error`: Any `storage.StorageError` returned by Firebase when trying to upload the file, or `undefined` if there is no error

#### Full example

```js
import { getStorage, storageRef } from 'firebase/storage';
import { useUploadFile } from 'react-firebase-hooks/storage';

const storage = getStorage(firebaseApp);

const UploadFile = () => {
  const [uploadFile, uploading, snapshot, error] = useUploadFile();
  const ref = storageRef(storage, 'file.jpg');
  const [selectedFile, setSelectedFile] = useState<File>();

  const upload = async () => {
    if (selectedFile) {
      const result = await uploadFile(ref, selectedFile, {
        contentType: 'image/jpeg'
      });
      alert(`Result: ${JSON.stringify(result)}`);
    }
  }

  return (
    <div>
      <p>
        {error && <strong>Error: {error.message}</strong>}
        {uploading && <span>Uploading file...</span>}
        {snapshot && <span>Snapshot: {JSON.stringify(snapshot)}</span>}
        {selectedFile && <span>Selected file: {selectedFile.name}</span>}
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : undefined;
            setSelectedFile(file);
          }}
        />
        <button onClick={upload}>Upload file</button>
      </p>
    </div>
  )
}
```
