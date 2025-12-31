/**
 The set of valid types for `T` in `Lazy<T>`.

 Migrated from `/Volumes/CODE/axhxrx-mmxxv/libs/ts/core/src/lib/resolve/ResolvableType.ts`

 In an ideal world, the `Lazy<T>` type would allow `T` to be any type. In the real TypeScript world, though, it cannot be a `Function` type for pragmatic reasons.

 So this type is not quite as broad as we wish it could be. But through the magic of unit tests, we made it pretty flexible and you can use it with most real-world types that aren't functions.

 (The `Array<unknown>` and `Record<string, unknown>` make it work with most arrays and objects.)
 */
export type LazyType =
  | true
  | false
  | boolean
  | null
  | number
  | string
  | undefined
  | Array<unknown>
  | Record<string, unknown>;
// The reason we don't allow `object` is that functions are objects and we don't want to allow functions.
// | object;
// The reason we don't allow Function is because all kinds of shit is `Function` in TS (e.g. any class), and it is inherently untyped in terms of args/result, and thus makes things error-prone without much reason to allow it. We would therefore have to ask somebody smart to think about it if we ever did want to allow it. 😉
// | Function;

/**
 The `lazy()` function is a utility function that takes a `Lazy<T>` and returns a `T`.

 NOTES: In the beginning, it seems natural to want to have a type like:

 ```
 // Doesn't actually work in TypeScript:
 function lazy(T | (() => T)) {
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
