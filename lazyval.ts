import type { LazyType } from './LazyType.ts';

/**
 The `lazyval()` function (supposed to sound like "lazy eval") is a utility function that takes a `Lazy<T>` and returns a `T`.

 NOTES: In the beginning, it seems natural to want to have a type like:

 ```
 // Doesn't actually work in TypeScript:
 function lazyval<T>(value: T | (() => T | undefined)) {
   return typeof value === 'function' ? value() : value;
 }
 ```
 ... but that [does not actually work in TypeScript](https://github.com/microsoft/TypeScript/issues/37663).
 */
export const lazyval = <T extends LazyType>(
  value: T | (() => T | undefined),
): T | undefined =>
{
  return typeof value === 'function' ? value() : value;
};
