import { Auth, onIdTokenChanged, User } from 'firebase/auth';
import { useEffect } from 'react';
import { LoadingHook, useLoadingValue } from '../util';

export type IdTokenHook = LoadingHook<User | null, Error>;

type IdTokenOptions = {
  onUserChanged?: (user: User | null) => Promise<void>;
};

export default (auth: Auth, options?: IdTokenOptions): IdTokenHook => {
  const { error, loading, setError, setValue, value } = useLoadingValue<
    User | null,
    Error
  >(() => auth.currentUser);

  useEffect(() => {
    const listener = onIdTokenChanged(
      auth,
      async (user) => {
        if (options?.onUserChanged) {
          // onUserChanged function to process custom claims on any other trigger function
          try {
            await options.onUserChanged(user);
          } catch (e) {
            setError(e as Error);
          }
        }
        setValue(user);
      },
      setError
    );

    return () => {
      listener();
    };
  }, [auth]);

  return [value, loading, error];
};
