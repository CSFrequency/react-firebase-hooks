# React Firebase Hooks - Cloud Messaging

React Firebase Hooks provides a convenience hook for getting a cloud messaging token, providing an `error` and `loading` property
to give a complete lifecycle for accessing the cloud messaging token on Firebase Cloud Messaging.

All hooks can be imported from `react-firebase-hooks/messaging`, e.g.

```js
import { useToken } from 'react-firebase-hooks/messaging';
```

List of Cloud Messaging hooks:

- [React Firebase Hooks - Cloud Messaging](#react-firebase-hooks---cloud-messaging)
  - [useToken](#usetoken)
    - [Full example](#full-example)

### useToken

```js
const [token, loading, error] = useToken(messaging, vapidKey);
```

Get a token from Firebase Cloud Messaging

The `useToken` hook takes the following parameters:

- `messaging`: `messaging.Messaging` instance for your Firebase app
- `vapidKey`: a `string` representing the VAPID key credential needed for Cloud Messaging

Returns:

- `token`: a `string` token to use with cloud messaging
- `loading`: a `boolean` to indicate if the function is still being executed
- `error`: Any `Error` returned by Firebase when trying to execute the function, or `undefined` if there is no error

#### Full example

```js
import { getMessaging } from 'firebase/messaging';
import { useToken } from 'react-firebase-hooks/messaging';

const MessagingToken = () => {
  const [token, loading, error] = useToken(getMessaging(firebaseApp));
  return (
    <div>
      <p>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Loading token...</span>}
        {token && <span>Token:{token}</span>}
      </p>
    </div>
  );
};
```
