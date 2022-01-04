import { useState, useMemo } from 'react';
import {
  Auth,
  AuthError,
  AuthProvider,
  CustomParameters,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';
import { SignInWithPopupHook } from './types';

export const useSignInWithApple = (auth: Auth): SignInWithPopupHook => {
  return useSignInWithOAuth(auth, 'apple.com');
};

export const useSignInWithFacebook = (auth: Auth): SignInWithPopupHook => {
  const createFacebookAuthProvider = (
    scopes?: string[],
    customOAuthParameters?: CustomParameters
  ) => {
    const provider = new FacebookAuthProvider();
    if (scopes) {
      scopes.forEach((scope) => provider.addScope(scope));
    }
    if (customOAuthParameters) {
      provider.setCustomParameters(customOAuthParameters);
    }
    return provider;
  };
  return useSignInWithPopup(auth, createFacebookAuthProvider);
};

export const useSignInWithGithub = (auth: Auth): SignInWithPopupHook => {
  const createGithubAuthProvider = (
    scopes?: string[],
    customOAuthParameters?: CustomParameters
  ) => {
    const provider = new GithubAuthProvider();
    if (scopes) {
      scopes.forEach((scope) => provider.addScope(scope));
    }
    if (customOAuthParameters) {
      provider.setCustomParameters(customOAuthParameters);
    }
    return provider;
  };
  return useSignInWithPopup(auth, createGithubAuthProvider);
};

export const useSignInWithGoogle = (auth: Auth): SignInWithPopupHook => {
  const createGoogleAuthProvider = (
    scopes?: string[],
    customOAuthParameters?: CustomParameters
  ) => {
    const provider = new GoogleAuthProvider();
    if (scopes) {
      scopes.forEach((scope) => provider.addScope(scope));
    }
    if (customOAuthParameters) {
      provider.setCustomParameters(customOAuthParameters);
    }
    return provider;
  };
  return useSignInWithPopup(auth, createGoogleAuthProvider);
};

export const useSignInWithMicrosoft = (auth: Auth): SignInWithPopupHook => {
  return useSignInWithOAuth(auth, 'microsoft.com');
};

export const useSignInWithTwitter = (auth: Auth): SignInWithPopupHook => {
  const createTwitterAuthProvider = (
    scopes?: string[],
    customOAuthParameters?: CustomParameters
  ) => {
    const provider = new TwitterAuthProvider();
    if (scopes) {
      scopes.forEach((scope) => provider.addScope(scope));
    }
    if (customOAuthParameters) {
      provider.setCustomParameters(customOAuthParameters);
    }
    return provider;
  };
  return useSignInWithPopup(auth, createTwitterAuthProvider);
};

export const useSignInWithYahoo = (auth: Auth): SignInWithPopupHook => {
  return useSignInWithOAuth(auth, 'yahoo.com');
};

const useSignInWithOAuth = (
  auth: Auth,
  providerId: string
): SignInWithPopupHook => {
  const createOAuthProvider = (
    scopes?: string[],
    customOAuthParameters?: CustomParameters
  ) => {
    const provider = new OAuthProvider(providerId);
    if (scopes) {
      scopes.forEach((scope) => provider.addScope(scope));
    }
    if (customOAuthParameters) {
      provider.setCustomParameters(customOAuthParameters);
    }
    return provider;
  };
  return useSignInWithPopup(auth, createOAuthProvider);
};

const useSignInWithPopup = (
  auth: Auth,
  createProvider: (
    scopes?: string[],
    customOAuthParameters?: CustomParameters
  ) => AuthProvider
): SignInWithPopupHook => {
  const [error, setError] = useState<AuthError>();
  const [loggedInUser, setLoggedInUser] = useState<UserCredential>();
  const [loading, setLoading] = useState<boolean>(false);

  const signInWithGoogle = async (
    scopes?: string[],
    customOAuthParameters?: CustomParameters
  ) => {
    setLoading(true);
    try {
      const provider = createProvider(scopes, customOAuthParameters);
      const user = await signInWithPopup(auth, provider);
      setLoggedInUser(user);
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const resArray: SignInWithPopupHook = [
    signInWithGoogle,
    loggedInUser,
    loading,
    error,
  ];
  return useMemo<SignInWithPopupHook>(() => resArray, resArray);
};
