# React Firebase Hooks - Auth

React Firebase Hooks provides a convenience listener for Firebase Auth's auth state. The hook wraps around the `auth.onAuthStateChange(...)` method to ensure that it is always up to date.

All hooks can be imported from `react-firebase-hooks/auth`, e.g.

```js
import { useAuthState } from 'react-firebase-hooks/auth';
```

List of Auth hooks:

- [useAuthState](#useauthstate)
- [useIdToken](#useidtoken)
- [useCreateUserWithEmailAndPassword](#usecreateuserwithemailandpassword)
- [useSignInWithEmailAndPassword](#usesigninwithemailandpassword)
- [useSignInWithCustomToken](#usesigninwithcustomtoken)
- [useSignInWithApple](#usesigninwithapple)
- [useSignInWithFacebook](#usesigninwithfacebook)
- [useSignInWithGithub](#usesigninwithgithub)
- [useSignInWithGoogle](#usesigninwithgoogle)
- [useSignInWithMicrosoft](#usesigninwithmicrosoft)
- [useSignInWithTwitter](#usesigninwithtwitter)
- [useSignInWithYahoo](#usesigninwithyahoo)
- [useSendSignInLinkToEmail](#usesendsigninlinktoemail)
- [useUpdateEmail](#useupdateemail)
- [useUpdatePassword](#useupdatepassword)
- [useUpdateProfile](#useupdateprofile)
- [useVerifyBeforeUpdateEmail](#useverifybeforeupdateemail)
- [useSendPasswordResetEmail](#usesendpasswordresetemail)
- [useSendEmailVerification](#usesendemailverification)
- [useSignOut](#usesignout)
- [useDeleteUser](#usedeleteuser)

### useAuthState

```js
const [user, loading, error] = useAuthState(auth, options);
```

Retrieve and monitor the authentication state from Firebase. Uses `auth.onAuthStateChanged` so is only triggered when a user signs in or signs out. See [useIdToken](#useidtoken) if you need to monitor token changes too.

The `useAuthState` hook takes the following parameters:

- `auth`: `auth.Auth` instance for the app you would like to monitor
- `options`: (optional) `Object with the following parameters:
  - `onUserChanged`: (optional) function to be called with `auth.User` each time the user changes. This allows you to do things like load custom claims.

Returns:

- `user`: The `auth.UserCredential` if logged in, or `null` if not
- `loading`: A `boolean` to indicate whether the authentication state is still being loaded
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
        <p>Current User: {user.user.email}</p>
        <button onClick={logout}>Log out</button>
      </div>
    );
  }
  return <button onClick={login}>Log in</button>;
};
```

### useIdToken

```js
const [user, loading, error] = useIdToken(auth, options);
```

Retrieve and monitor changes to the ID token from Firebase. Uses `auth.onIdTokenChanged` so includes when a user signs in, signs out or token refresh events.

The `useIdToken` hook takes the following parameters:

- `auth`: `auth.Auth` instance for the app you would like to monitor
- `options`: (optional) `Object with the following parameters:
  - `onUserChanged`: (optional) function to be called with `auth.User` each time the user changes. This allows you to do things like load custom claims.

Returns:

- `user`: The `auth.UserCredential` if logged in, or `null` if not
- `loading`: A `boolean` to indicate whether the authentication state is still being loaded
- `error`: Any `AuthError` returned by Firebase when trying to load the user, or `undefined` if there is no error

#### If you are registering or signing in the user for the first time consider using [useCreateUserWithEmailAndPassword](#usecreateuserwithemailandpassword), [useSignInWithEmailAndPassword](#usesigninwithemailandpassword)

#### Full Example

```js
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { useIdToken } from 'react-firebase-hooks/auth';

const auth = getAuth(firebaseApp);

const login = () => {
  signInWithEmailAndPassword(auth, 'test@test.com', 'password');
};
const logout = () => {
  signOut(auth);
};

const CurrentUser = () => {
  const [user, loading, error] = useIdToken(auth);

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
        <p>Current User: {user.user.email}</p>
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

- `createUserWithEmailAndPassword(email: string, password: string) => Promise<auth.UserCredential>`: A function you can call to start the registration. Returns the `auth.UserCredential` if the user was created successfully, or `undefined` if there was an error.
- `user`: The `auth.UserCredential` if the user was created or `undefined` if not
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
        <p>Registered User: {user.user.email}</p>
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

- `signInWithEmailAndPassword(email: string, password: string) => Promise<auth.UserCredential>`: A function you can call to start the login. Returns the `auth.UserCredential` if the user was signed in successfully, or `undefined` if there was an error.
- `user`: The `auth.UserCredential` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

### useSignInWithCustomToken

```js
const [
  signInWithCustomToken,
  user,
  loading,
  error,
] = useSignInWithCustomToken(auth);
```

Login a user with secure JSON Web Tokens (JWTs) generated by your servers. Wraps the underlying `auth.signInWithCustomToken` method and provides additional `loading` and `error` information.

The `useSignInWithCustomToken` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithCustomToken(token: string) => Promise<auth.UserCredential>`: A function you can call to start the login. Returns the `auth.UserCredential` if the user was signed in successfully, or `undefined` if there was an error.
- `user`: The `auth.UserCredential` if the user was logged in or `undefined` if not
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

- `signInWithApple(scopes: string[], customOAuthParameters: auth.CustomParameters) => Promise<auth.UserCredential>`: A function you can call to start the login. Returns the `auth.UserCredential` if the user was signed in successfully, or `undefined` if there was an error.
- `user`: The `auth.UserCredential` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full example

See [social login example](#social-login-example)

### useSignInWithFacebook

```js
const [signInWithFacebook, user, loading, error] = useSignInWithFacebook(auth);
```

Login a user with Facebook Authenticatiton. Wraps the underlying `auth.signInWithPopup` method with the `auth.OAuthProvider` and provides additional `loading` and `error` information.

The `useSignInWithFacebook` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithFacebook(scopes: string[], customOAuthParameters: auth.CustomParameters) => Promise<auth.UserCredential>`: A function you can call to start the login. Returns the `auth.UserCredential` if the user was signed in successfully, or `undefined` if there was an error.
- `user`: The `auth.UserCredential` if the user was logged in or `undefined` if not
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

- `signInWithGithub(scopes: string[], customOAuthParameters: auth.CustomParameters) => Promise<auth.UserCredential>`: A function you can call to start the login. Returns the `auth.UserCredential` if the user was signed in successfully, or `undefined` if there was an error.
- `user`: The `auth.UserCredential` if the user was logged in or `undefined` if not
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

- `signInWithGoogle(scopes: string[], customOAuthParameters: auth.CustomParameters) => Promise<auth.UserCredential>`: A function you can call to start the login. Returns the `auth.UserCredential` if the user was signed in successfully, or `undefined` if there was an error.
- `user`: The `auth.UserCredential` if the user was logged in or `undefined` if not
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

Login a user with Microsoft Authenticatiton. Wraps the underlying `auth.signInWithPopup` method with the `auth.OAuthProvider` and provides additional `loading` and `error` information.

The `useSignInWithMicrosoft` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithMicrosoft(scopes: string[], customOAuthParameters: auth.CustomParameters) => Promise<auth.UserCredential>`: A function you can call to start the login. Returns the `auth.UserCredential` if the user was signed in successfully, or `undefined` if there was an error.
- `user`: The `auth.UserCredential` if the user was logged in or `undefined` if not
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

- `signInWithTwitter(scopes: string[], customOAuthParameters: auth.CustomParameters) => Promise<auth.UserCredential>`: A function you can call to start the login. Returns the `auth.UserCredential` if the user was signed in successfully, or `undefined` if there was an error.
- `user`: The `auth.UserCredential` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full example

See [social login example](#social-login-example)

### useSignInWithYahoo

```js
const [signInWithYahoo, user, loading, error] = useSignInWithYahoo(auth);
```

Login a user with Yahoo Authentication. Wraps the underlying `auth.signInWithPopup` method with the `auth.OAuthProvider` and provides additional `loading` and `error` information.

The `useSignInWithYahoo` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithYahoo(scopes: string[], customOAuthParameters: auth.CustomParameters) => Promise<auth.UserCredential>`: A function you can call to start the login. Returns the `auth.UserCredential` if the user was signed in successfully, or `undefined` if there was an error.
- `user`: The `auth.UserCredential` if the user was logged in or `undefined` if not
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

### useSendSignInLinkToEmail

```js
const [sendSignInLinkToEmail, sending, error] = useSendSignInLinkToEmail(auth);
```

Sends a sign-in email link to the user with the specified email. Wraps the underlying `auth.sendSignInLinkToEmail` method and provides additional `sending` and `error` information.

To complete sign in with the email link use the [useSignInWithEmailLink](#usesigninwithemaillink) hook.

The `useSendSignInLinkToEmail` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `sendSignInLinkToEmail(email: string, actionCodeSettings: ActionCodeSettings) => Promise<boolean>`: A function you can call to send a sign-in email link to an email. Requires an [actionCodeSettings](https://firebase.google.com/docs/reference/js/auth.actioncodesettings.md#actioncodesettings_interface) object. Returns `true` if the function was successful, or `false` if there was an error.
- `sending`: A `boolean` to indicate whether the email is being sent
- `error`: Any `Error` returned by Firebase when trying to send the email, or `undefined` if there is no error

#### Full Example

```jsx
import { useSendSignInLinkToEmail } from 'react-firebase-hooks/auth';

const SendSignInLinkToEmail = () => {
  const [email, setEmail] = useState('');
  const [sendSignInLinkToEmail, sending, error] = useSendSignInLinkToEmail(
    auth
  );

  const actionCodeSettings = {
    // The URL to redirect to for sign-in completion. This is also the deep
    // link for mobile redirects. The domain (www.example.com) for this URL
    // must be whitelisted in the Firebase Console.
    url: 'https://www.example.com/finishSignUp?cartId=1234',
    iOS: {
      bundleId: 'com.example.ios',
    },
    android: {
      packageName: 'com.example.android',
      installApp: true,
      minimumVersion: '12',
    },
    // This must be true.
    handleCodeInApp: true,
  };

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
          const success = await sendSignInLinkToEmail(
            email,
            actionCodeSettings
          );
          if (success) {
            alert('Sent email');
          }
        }}
      >
        Reset password
      </button>
    </div>
  );
};
```

### useSignInWithEmailLink

```js
const [signInWithEmailLink, user, loading, error] = useSignInWithEmailLink(
  auth
);
```

Login a user using an email and sign-in email link. Wraps the underlying `auth.signInWithEmailLink` method and provides additional `loading` and `error` information.

The `useSignInWithEmailLink` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signInWithEmailLink(email: string, emailLink?: string) => Promise<auth.UserCredential>`: A function you can call to start the login. If no `emailLink` is supplied, the link is inferred from the current URL. Returns the `auth.UserCredential` if the user was signed in successfully, or `undefined` if there was an error.
- `user`: The `auth.UserCredential` if the user was logged in or `undefined` if not
- `loading`: A `boolean` to indicate whether the the user login is processing
- `error`: Any `Error` returned by Firebase when trying to login the user, or `undefined` if there is no error

#### Full Example

```jsx
import { useSignInWithEmailLink } from 'react-firebase-hooks/auth';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [
    signInWithEmailLink
    user,
    loading,
    error,
  ] = useSignInWithEmailLink(auth);

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
      <button onClick={() => signInWithEmailLink(email, emailLink)}>
        Sign In
      </button>
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

- `updateEmail(email: string) => Promise<boolean>`: A function you can call to update the current user's email address. Returns `true` if the function was successful, or `false` if there was an error.
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
          const success = await updateEmail(email);
          if (success) {
            alert('Updated email address');
          }
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

- `updatePassword(password: string) => Promise<boolean>`: A function you can call to update the current user's password. Returns `true` if the function was successful, or `false` if there was an error.
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
          const success = await updatePassword(password);
          if (success) {
            alert('Updated password');
          }
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

- `updateProfile({ displayName: string, photoURL: string }) => Promise<boolean>`: A function you can call to update the current user's profile. Returns `true` if the function was successful, or `false` if there was an error.
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
          const success = await updateProfile({ displayName, photoURL });
          if (success) {
            alert('Updated profile');
          }
        }}
      >
        Update profile
      </button>
    </div>
  );
};
```

### useVerifyBeforeUpdateEmail

```js
const [verifyBeforeUpdateEmail, updating, error] = useVerifyBeforeUpdateEmail(
  auth
);
```

Verify and update the current user's email address. Wraps the underlying `auth.verifyBeforeUpdateEmail` method and provides additional `updating` and `error` information.

The `useVerifyBeforeUpdateEmail` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `verifyBeforeUpdateEmail(email: string, actionCodeSettings: ActionCodeSettings | null) => Promise<boolean>`: A function you can call to verify and update the current user's email address. Returns `true` if the function was successful, or `false` if there was an error.
- `updating`: A `boolean` to indicate whether the user update is processing
- `error`: Any `Error` returned by Firebase when trying to update the user, or `undefined` if there is no error

#### Full Example

```jsx
import { useVerifyBeforeUpdateEmail } from 'react-firebase-hooks/auth';

const VerifyBeforeUpdateEmail = () => {
  const [email, setEmail] = useState('');
  const [verifyBeforeUpdateEmail, updating, error] = useVerifyBeforeUpdateEmail(
    auth
  );

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
          const success = await verifyBeforeUpdateEmail(email);
          if (success) {
            alert(
              'Please check your email to verify your updated email address'
            );
          }
        }}
      >
        Update email
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

- `sendPasswordResetEmail(email: string, actionCodeSettings?: ActionCodeSettings) => Promise<boolean>`: A function you can call to send a password reset email. Optionally accepts an [actionCodeSettings](https://firebase.google.com/docs/reference/js/auth.actioncodesettings.md#actioncodesettings_interface) object. Returns `true` if the function was successful, or `false` if there was an error.
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

  const actionCodeSettings = {
    url: 'https://www.example.com/login',
  };

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
          const success = await sendPasswordResetEmail(
            email,
            actionCodeSettings
          );
          if (success) {
            alert('Sent email');
          }
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

- `sendEmailVerification() => Promise<boolean>`: A function you can call to send a password reset email. Returns `true` if the function was successful, or `false` if there was an error.
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
          const success = await sendEmailVerification();
          if (success) {
            alert('Sent email');
          }
        }}
      >
        Verify email
      </button>
    </div>
  );
};
```

### useSignOut

```js
const [signOut, loading, error] = useSignOut(auth);
```

Sign out current user. Wraps the underlying `auth.signOut` method and provides additional `loading` and `error` information.

The `useSignOut` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `signOut() => Promise<boolean>`: A function you can call to sign out current user. Returns `true` if the function was successful, or `false` if there was an error.
- `loading`: A `boolean` to indicate whether the user is being signed out
- `error`: Any `Error` returned by Firebase when trying to sign out user, or `undefined` if there is no error

#### Full Example

```jsx
import { useSignOut } from 'react-firebase-hooks/auth';

const SignOut = () => {
  const [signOut, loading, error] = useSignOut(auth);

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
  return (
    <div className="App">
      <button
        onClick={async () => {
          const success = await signOut();
          if (success) {
            alert('You are sign out');
          }
        }}
      >
        Sign out
      </button>
    </div>
  );
};
```

### useDeleteUser

```js
const [deleteUser, loading, error] = useDeleteUser(auth);
```

Delete current user. Wraps the underlying `auth.currrentUser.delete` method and provides additional `loading` and `error` information.

The `useDeleteUser` hook takes the following parameters:

- `auth`: `Auth` instance for the app you would like to monitor

Returns:

- `deleteUser() => Promise<boolean>`: A function you can call to delete the current user. Returns `true` if the function was successful, or `false` if there was an error.
- `loading`: A `boolean` to indicate whether the deletion is processing
- `error`: Any `Error` returned by Firebase when trying to delete user, or `undefined` if there is no error

#### Full Example

```jsx
import { useDeleteUser } from 'react-firebase-hooks/auth';

const DeleteUser = () => {
  const [deleteUser, loading, error] = useDeleteUser(auth);

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
  return (
    <div className="App">
      <button
        onClick={async () => {
          const success = await deleteUser();
          if (success) {
            alert('You have been deleted');
          }
        }}
      >
        Delete current user
      </button>
    </div>
  );
};
```
