# React Firebase Hooks - Cloud Functions

React Firebase Hooks provides a convenience hook for HttpsCallable functions, providing an `error` and `loading` property
to give a complete lifecycle for executing a HttpsCallable function on Firebase Cloud Functions.

All hooks can be imported from `react-firebase-hooks/functions`, e.g.

```js
import { useHttpsCallable } from 'react-firebase-hooks/functions';
```

List of Cloud Functions hooks:

- [React Firebase Hooks - Cloud Functions](#react-firebase-hooks---cloud-functions)
  - [useHttpsCallable](#usehttpscallable)
    - [Full example](#full-example)

### useHttpsCallable

```js
const [executeCallable, loading, error] = useHttpsCallable(functions, name);
```

Generate a callable function and monitor its execution.

The `useHttpsCallable` hook takes the following parameters:

- `functions`: `functions.Functions` instance for your Firebase app
- `name`: A `string` representing the name of the function to call

Returns:

- `executeCallable(data)`: a function you can call to execute the HttpsCallable
- `loading`: a `boolean` to indicate if the function is still being executed
- `error`: Any `Error` returned by Firebase when trying to execute the function, or `undefined` if there is no error

#### Full example

```js
import { getFunctions } from 'firebase/functions';
import { useHttpsCallable } from 'react-firebase-hooks/functions';

const HttpsCallable = () => {
  const [executeCallable, executing, error] = useHttpsCallable(
    getFunctions(firebaseApp),
    'myHttpsCallable'
  );
  return (
    <div>
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {executing && <span>Function executing...</span>}
        <button
          onClick={async () => {
            await executeCallable();
            alert('Executed function');
          }}
        >
          Execute callable function
        </button>
      </p>
    </div>
  );
};
```
