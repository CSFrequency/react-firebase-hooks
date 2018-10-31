import { resolve } from 'path';
import commonjs from 'rollup-plugin-commonjs';
import resolveModule from 'rollup-plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

import pkg from './package.json';
import authPkg from './auth/package.json';
import databasePkg from './database/package.json';
import firestorePkg from './firestore/package.json';
import storagePkg from './storage/package.json';

const pkgsByName = {
  auth: authPkg,
  database: databasePkg,
  firestore: firestorePkg,
  storage: storagePkg,
};

const plugins = [
  resolveModule(),
  typescript({
    typescript: require('typescript'),
  }),
  commonjs(),
];

const external = Object.keys(pkg.peerDependencies || {});

const components = ['auth', 'database', 'firestore', 'storage'];

export default components
  .map(component => {
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
        plugins: [...plugins, uglify()],
        external,
      },
    ];
  })
  .reduce((a, b) => a.concat(b), []);
