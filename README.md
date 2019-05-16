# React Firebase Hooks (v2)

A set of reusable [React Hooks](https://reactjs.org/docs/hooks-intro.html) for [Firebase](https://firebase.google.com/).

[![npm version](https://img.shields.io/npm/v/react-firebase-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-firebase-hooks)
[![npm downloads](https://img.shields.io/npm/dm/react-firebase-hooks.svg?style=flat-square)](https://www.npmjs.com/package/react-firebase-hooks)

> Official support for Hooks was added to React Native in v0.59.0. React Firebase Hooks works with both the Firebase JS SDK and React Native Firebase, although some of the Flow and Typescript typings may be incorrect - we are investigating ways to improve this for React Native Firebase users.

**This documentation is for v2 of React Firebase Hooks which is currently at the Release Candidate stage for testing. For v1 documentation, click [here](https://github.com/CSFrequency/react-firebase-hooks/tree/v1.2.1).**

## Installation

React Firebase Hooks requires **React 16.8.0 or later** and **Firebase v5.0.0 or later**.

```
npm install --save react-firebase-hooks@next
```

This assumes that you’re using the [npm](https://npmjs.com) package manager with a module bundler like [Webpack](https://webpack.js.org/) or [Browserify](http://browserify.org/) to consume [CommonJS](http://webpack.github.io/docs/commonjs.html) modules.

## Why?

There has been a **lot** of hype around React Hooks, but this hype merely reflects that there are obvious real world benefits of Hooks to React developers everywhere.

This library explores how React Hooks can work to make integration with Firebase even more straightforward than it already is. It takes inspiration for naming from RxFire and is based on an internal library that we had been using in a number of apps prior to the release of React Hooks. The implementation with hooks is 10x simpler than our previous implementation.

## Documentation

- [Auth Hooks](/auth)
- [Cloud Firestore Hooks](/firestore)
- [Cloud Storage Hooks](/storage)
- [Realtime Database Hooks](/database)

## License

- See [LICENSE](/LICENSE)
