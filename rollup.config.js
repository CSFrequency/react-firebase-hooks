import { resolve } from 'path';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import resolveModule from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';
import authPkg from './auth/package.json';
import databasePkg from './database/package.json';
import firestorePkg from './firestore/package.json';
import functionsPkg from './functions/package.json';
import messagingPkg from './messaging/package.json';
import storagePkg from './storage/package.json';
import utilPkg from './util/package.json';

const pkgsByName = {
  auth: authPkg,
  database: databasePkg,
  firestore: firestorePkg,
  functions: functionsPkg,
  messaging: messagingPkg,
  storage: storagePkg,
  util: utilPkg,
};

const plugins = [
  resolveModule(),
  typescript({
    typescript: require('typescript'),
  }),
  commonjs(),
];

const external = [
  ...Object.keys(pkg.peerDependencies),
  'firebase/util',
  'firebase/auth',
  'firebase/database',
  'firebase/firestore',
  'firebase/functions',
  'firebase/messaging',
  'firebase/storage',
];

const components = [
  'util',
  'auth',
  'database',
  'firestore',
  'functions',
  'messaging',
  'storage',
];

export default components
  .map((component) => {
    const pkg = pkgsByName[component];
    return [
      {
        input: `${component}/index.ts`,
        output: [
          { file: resolve(component, pkg.main), format: 'cjs' },
          { file: resolve(component, pkg.module), format: 'es' },
        ],
        plugins,
        external,
      },
      {
        input: `${component}/index.ts`,
        output: {
          file: `dist/react-firebase-hooks-${component}.js`,
          format: 'iife',
          sourcemap: true,
          extend: true,
          name: 'react-firebase-hooks',
          globals: {
            react: 'react',
          },
        },
        plugins: [
          ...plugins,
          terser(),
          // Copy flow files
          copy({
            [`${component}/index.js.flow`]: `${component}/dist/index.cjs.js.flow`,
          }),
          copy({
            [`${component}/index.js.flow`]: `${component}/dist/index.esm.js.flow`,
          }),
        ],
        external,
      },
    ];
  })
  .reduce((a, b) => a.concat(b), []);
