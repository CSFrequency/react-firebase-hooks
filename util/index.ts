export { default as useLoadingValue } from './useLoadingValue';
export * from './refHooks';

export type LoadingHook<T, E> = [T | void, boolean, E | void];
