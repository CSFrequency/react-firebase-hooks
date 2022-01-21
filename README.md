# React Firebase Hooks

A set of reusable [React Hooks](https://reactjs.org/docs/hooks-intro.html) for [Firebase](https://firebase.google.com/).

[![npm version](https://img.shields.io/npm/v/react-firebase-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-firebase-hooks)
[![npm downloads](https://img.shields.io/npm/dm/react-firebase-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-firebase-hooks)

This documentation is for v5 of React Firebase Hooks which requires Firebase v9 or higher.

- For v3 documentation (Firebase v9), see [here](https://github.com/CSFrequency/react-firebase-hooks/tree/v4.0.2).
- For v3 documentation (Firebase v8), see [here](https://github.com/CSFrequency/react-firebase-hooks/tree/v3.0.4).
- For v2 documentation, see [here](https://github.com/CSFrequency/react-firebase-hooks/tree/v2.2.0).

## Installation

React Firebase Hooks v4 requires **React 16.8.0 or later** and **Firebase v9.0.0 or later**.

> Whilst previous versions of React Firebase Hooks had some support for React Native Firebase, the underlying changes to v9 of the Firebase Web library have meant this is no longer as straightforward. We will investigate if this is possible in another way as part of a future release.

```bash
# with npm
npm install --save react-firebase-hooks

# with yarn
yarn add react-firebase-hooks
```

This assumes that you’re using the [npm](https://npmjs.com) or [yarn](https://yarnpkg.com/) package managers with a module bundler like [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/) to consume [CommonJS](http://webpack.github.io/docs/commonjs.html) modules.

## Why?

This library explores how React Hooks can work to make integration with Firebase even more straightforward than it already is. It takes inspiration for naming from RxFire and is based on an internal library that we had been using in a number of apps prior to the release of React Hooks. The implementation with hooks is 10x simpler than our previous implementation.

## Upgrading from v4 to v5

To upgrade your project from v4 to v5 check out the [Release Notes](https://github.com/CSFrequency/react-firebase-hooks/releases/tag/v5.0.0) which have full details of everything that needs to be changed.

## Documentation

- [Authentication Hooks](/auth)
- [Cloud Firestore Hooks](/firestore)
- [Cloud Functions Hooks](/functions)
- [Cloud Messaging Hooks](/messaging)
- [Cloud Storage Hooks](/storage)
- [Realtime Database Hooks](/database)

## License

- See [LICENSE](/LICENSE)
