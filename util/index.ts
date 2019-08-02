export { default as useLoadingValue } from './useLoadingValue';
export * from './refHooks';

export type LoadingHook<T, E> = [T | undefined, boolean, E | undefined];
