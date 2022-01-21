# React Firebase Hooks - Auth

React Firebase Hooks provides a convenience listener for Firebase Auth's auth state. The hook wraps around the `auth.onAuthStateChange(...)` method to ensure that it is always up to date.

All hooks can be imported from `react-firebase-hooks/auth`, e.g.

```js
import { useAuthState } from 'react-firebase-hooks/auth';
```

List of Auth hooks:

- [useAuthState](#useauthstate)
- [useCreateUserWithEmailAndPassword](#usecreateuserwithemailandpassword)
- [useSignInWithEmailAndPassword](#usesigninwithemailandpassword)
- [useSignInWithApple](#usesigninwithapple)
- [useSignInWithFacebook](#usesigninwithfacebook)
- [useSignInWithGithub](#usesigninwithgithub)
- [useSignInWithGoogle](#usesigninwithgoogle)
- [useSignInWithMicrosoft](#usesigninwithmicrosoft)
- [useSignInWithTwitter](#usesigninwithtwitter)
- [useSignInWithYahoo](#usesigninwithyahoo)
- [useUpdateEmail](#useupdateemail)
- [useUpdatePassword](#useupdatepassword)
- [useUpdateProfile](#useupdateprofile)
- [useSendPasswordResetEmail](#usesendpasswordresetemail)
- [useSendEmailVerification](#usesendemailverification)

### useAuthState

```js
const [user, loading, error] = useAuthState(auth, options);
```

Retrieve and monitor the authentication state from Firebase.

The `useAuthState` hook takes the following parameters:

- `auth`: `auth.Auth` instance for the app you would like to monitor
- `options`: (optional) `Object with the following parameters:
  - `onUserChanged`: (optional) function to be called with `auth.User` each time the user changes. This allows you to do things like load custom claims.

Returns:

- `user`: The `auth.User` if logged in, or `null` if not
- `loading`: A `boolean` to indicate whether the the authentication state is still being loaded
- `error`: Any `AuthError` returned by Firebase when trying to load the user, or `undefined` if there is no error

#### If you are registering or signing in the user for the first time consider using [useCreateUserWithEmailAndPassword](#usecreateuserwithemailandpassword), [useSignInWithEmailAndPassword](#usesigninwithemailandpassword)

#### Full Example

```js
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const auth = getAuth(firebaseApp);

const login = () => {
  signInWithEmailAndPassword(auth, 'test@test.com', 'password');
};
const logout = () => {
  signOut(auth);
};

const CurrentUser = () => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <p>Current User: {user.email}</p>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }
  return <button onClick={login}>Log in</button>;
};
```

### useCreateUserWithEmailAndPassword

```js
const [
  createUserWithEmailAndPassword,
  user,
  loading,
  error,
] = useCreateUserWithEmailAndPassword(auth);
```

Create a user with email and password. Wraps the underlying `firebase.auth().createUserWithEmailAndPassword` method and provides additional `loading` and `error` information.

The `useCreateUserWithEmailAndPassword` hook takes the following parameters:

- `auth`: `auth.Auth` instance for the app you would like to monitor
- `options`: (optional) `Object` with the following parameters:
  - `emailVerificationOptions`: (optional) `auth.ActionCodeSettings` to customise the email verification
  - `sendEmailVerification`: (optional) `boolean` to trigger sending of an email verification after the user has been created

Returns:

- `createUserWithEmailAndPassword(email: string, password: string)`: a function you can call to start the registration
- `user`: The `User` if the user was created or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user creation is processing
- `error`: Any `Error` returned by Firebase when trying to create the user, or `undefined` if there is no error

#### Full Example

```jsx
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    createUserWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useCreateUserWithEmailAndPassword(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) {
    return (
      <div>
        <p>Registered User: {user.email}</p>
      </div>
    );
  }
  return (
    <div className="App">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => createUserWithEmailAndPassword(email, password)}>
        Register
      </button>
    </div>
  );
};
```

### useSignInWithEmailAndPassword

```js
const [
  signInWithEmailAndPassword,
  user,
  loading,
  error,
] = useSignInWithEmailAndPassword(auth);
```

Login a user with email and password. Wraps the underlying `auth.signInWithEmailAndPassword` method and provides additional `loading` and `error` information.

The `useSignInWithEmailAndPassword` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithEmailAndPassword(email: string, password: string)`: a function you can call to start the login
- `user`: The `auth.User` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full Example

```jsx
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    signInWithEmailAndPassword,
    user,
    loading,
    error,
  ] = useSignInWithEmailAndPassword(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) {
    return (
      <div>
        <p>Signed In User: {user.email}</p>
      </div>
    );
  }
  return (
    <div className="App">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => signInWithEmailAndPassword(email, password)}>
        Sign In
      </button>
    </div>
  );
};
```

### useSignInWithApple

```js
const [signInWithApple, user, loading, error] = useSignInWithApple(auth);
```

Login a user with Apple Authenticatiton. Wraps the underlying `auth.signInWithPopup` method with the `auth.OAuthProvider` and provides additional `loading` and `error` information.

The `useSignInWithApple` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithApple(scopes: string[], customOAuthParameters: auth.CustomParameters)`: a function you can call to start the login
- `user`: The `auth.User` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full example

See [social login example](#social-login-example)

### useSignInWithFacebook

```js
const [signInWithFacebook, user, loading, error] = useSignInWithFacebook(auth);
```

Login a user with Facebook Authenticatiton. Wraps the underlying `auth.signInWithPopup` method with the `auth.OAuthProvider` and provides additional `loading` and `error` information.

The `useSignInWithApple` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithFacebook(scopes: string[], customOAuthParameters: auth.CustomParameters)`: a function you can call to start the login
- `user`: The `auth.User` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full example

See [social login example](#social-login-example)

### useSignInWithGithub

```js
const [signInWithGithub, user, loading, error] = useSignInWithGithub(auth);
```

Login a user with Github Authenticatiton. Wraps the underlying `auth.signInWithPopup` method with the `auth.OAuthProvider` and provides additional `loading` and `error` information.

The `useSignInWithGithub` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithGithub(scopes: string[], customOAuthParameters: auth.CustomParameters)`: a function you can call to start the login
- `user`: The `auth.User` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full example

See [social login example](#social-login-example)

### useSignInWithGoogle

```js
const [signInWithGoogle, user, loading, error] = useSignInWithGoogle(auth);
```

Login a user with Google Authenticatiton. Wraps the underlying `auth.signInWithPopup` method with the `auth.GoogleProvider` and provides additional `loading` and `error` information.

The `useSignInWithGoogle` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithGoogle(scopes: string[], customOAuthParameters: auth.CustomParameters)`: a function you can call to start the login
- `user`: The `auth.User` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full example

See [social login example](#social-login-example)

### useSignInWithMicrosoft

```js
const [signInWithMicrosoft, user, loading, error] = useSignInWithMicrosoft(
  auth
);
```

Login a user with Microsoftt Authenticatiton. Wraps the underlying `auth.signInWithPopup` method with the `auth.OAuthProvider` and provides additional `loading` and `error` information.

The `useSignInWithMicrosoft` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithMicrosoft(scopes: string[], customOAuthParameters: auth.CustomParameters)`: a function you can call to start the login
- `user`: The `auth.User` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full example

See [social login example](#social-login-example)

### useSignInWithTwittter

```js
const [signInWithTwitter, user, loading, error] = useSignInWithTwitter(auth);
```

Login a user with Twitter Authenticatiton. Wraps the underlying `auth.signInWithPopup` method with the `auth.OAuthProvider` and provides additional `loading` and `error` information.

The `useSignInWithTwitter` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithTwitter(scopes: string[], customOAuthParameters: auth.CustomParameters)`: a function you can call to start the login
- `user`: The `auth.User` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full example

See [social login example](#social-login-example)

### useSignInWithYahoo

```js
const [signInWithYahoo, user, loading, error] = useSignInWithYahoo(auth);
```

Login a user with Yahoo Authenticatiton. Wraps the underlying `auth.signInWithPopup` method with the `auth.OAuthProvider` and provides additional `loading` and `error` information.

The `useSignInWithYahoo` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithYahoo(scopes: string[], customOAuthParameters: auth.CustomParameters)`: a function you can call to start the login
- `user`: The `auth.User` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full example

See [social login example](#social-login-example)

### Social Login Example

```jsx
import { useSignInWithXXX } from 'react-firebase-hooks/auth';

const SignIn = () => {
  const [signInWithXXX, user, loading, error] = useSignInWithXXX(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (loading) {
    return <p>Loading...</p>;
  }
  if (user) {
    return (
      <div>
        <p>Signed In User: {user.email}</p>
      </div>
    );
  }
  return (
    <div className="App">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={() => signInWithXXX()}>Sign In</button>
    </div>
  );
};
```

### useUpdateEmail

```js
const [updateEmail, updating, error] = useUpdateEmail(auth);
```

Update the current user's email address. Wraps the underlying `auth.updateEmail` method and provides additional `updating` and `error` information.

The `useUpdateEmail` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `updateEmail(email: string)`: a function you can call to update the current user's email addres
- `updating`: A `boolean` to indicate whether the user update is processing
- `error`: Any `Error` returned by Firebase when trying to update the user, or `undefined` if there is no error

#### Full Example

```jsx
import { useUpdateEmail } from 'react-firebase-hooks/auth';

const UpdateEmail = () => {
  const [email, setEmail] = useState('');
  const [updateEmail, updating, error] = useUpdateEmail(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (updating) {
    return <p>Updating...</p>;
  }
  return (
    <div className="App">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={async () => {
          await updateEmail(email);
          alert('Updated email address');
        }}
      >
        Update email
      </button>
    </div>
  );
};
```

### useUpdatePassword

```js
const [updatePassword, updating, error] = useUpdatePassword(auth);
```

Update the current user's password. Wraps the underlying `auth.updatePassword` method and provides additional `updating` and `error` information.

The `useUpdatePassword` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `updatePassword(password: string)`: a function you can call to update the current user's password
- `updating`: A `boolean` to indicate whether the user update is processing
- `error`: Any `Error` returned by Firebase when trying to update the user, or `undefined` if there is no error

#### Full Example

```jsx
import { useUpdatePassword } from 'react-firebase-hooks/auth';

const UpdatePassword = () => {
  const [password, setPassword] = useState('');
  const [updatePassword, updating, error] = useUpdatePassword(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (updating) {
    return <p>Updating...</p>;
  }
  return (
    <div className="App">
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={async () => {
          await updatePassword(email);
          alert('Updated password');
        }}
      >
        Update password
      </button>
    </div>
  );
};
```

### useUpdateProfile

```js
const [updateProfile, updating, error] = useUpdateProfile(auth);
```

Update the current user's profile. Wraps the underlying `auth.updateProfile` method and provides additional `updating` and `error` information.

The `useUpdateProfile` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `updateProfile({ displayName: string, photoURL: string })`: a function you can call to update the current user's profile
- `updating`: A `boolean` to indicate whether the user update is processing
- `error`: Any `Error` returned by Firebase when trying to update the user, or `undefined` if there is no error

#### Full Example

```jsx
import { useUpdateProfile } from 'react-firebase-hooks/auth';

const UpdateProfile = () => {
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [updateProfile, updating, error] = useUpdateProfile(auth);

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (updating) {
    return <p>Updating...</p>;
  }
  return (
    <div className="App">
      <input
        type="displayName"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <input
        type="photoURL"
        value={photoURL}
        onChange={(e) => setPhotoURL(e.target.value)}
      />
      <button
        onClick={async () => {
          await updateProfile({ displayName, photoURL });
          alert('Updated profile');
        }}
      >
        Update profile
      </button>
    </div>
  );
};
```

### useSendPasswordResetEmail

```js
const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(
  auth
);
```

Send a password reset email to the specified email address. Wraps the underlying `auth.sendPasswordResetEmail` method and provides additional `sending` and `error` information.

The `useSendPasswordResetEmail` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `sendPasswordResetEmail(email: string)`: a function you can call to send a password reset emaail
- `sending`: A `boolean` to indicate whether the email is being sent
- `error`: Any `Error` returned by Firebase when trying to send the email, or `undefined` if there is no error

#### Full Example

```jsx
import { useSendPasswordResetEmail } from 'react-firebase-hooks/auth';

const SendPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [sendPasswordResetEmail, sending, error] = useSendPasswordResetEmail(
    auth
  );

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (sending) {
    return <p>Sending...</p>;
  }
  return (
    <div className="App">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={async () => {
          await sendPasswordResetEmail(email);
          alert('Sent email');
        }}
      >
        Reset password
      </button>
    </div>
  );
};
```

### useSendEmailVerification

```js
const [sendEmailVerification, sending, error] = useSendEmailVerification(auth);
```

Send a verification email to the current user. Wraps the underlying `auth.sendEmailVerification` method and provides additional `sending` and `error` information.

The `useSendEmailVerification` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `sendEmailVerification()`: a function you can call to send a password reset emaail
- `sending`: A `boolean` to indicate whether the email is being sent
- `error`: Any `Error` returned by Firebase when trying to send the email, or `undefined` if there is no error

#### Full Example

```jsx
import { useSendEmailVerification } from 'react-firebase-hooks/auth';

const SendEmailVerification = () => {
  const [email, setEmail] = useState('');
  const [sendEmailVerification, sending, error] = useSendEmailVerification(
    auth
  );

  if (error) {
    return (
      <div>
        <p>Error: {error.message}</p>
      </div>
    );
  }
  if (sending) {
    return <p>Sending...</p>;
  }
  return (
    <div className="App">
      <button
        onClick={async () => {
          await sendEmailVerification();
          alert('Sent email');
        }}
      >
        Verify email
      </button>
    </div>
  );
};
```
