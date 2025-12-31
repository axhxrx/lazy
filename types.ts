/**
 Utility type for basing other types on, and using with [lazy()](./lazy.ts).

 Migrated from `/Volumes/CODE/axhxrx-mmxxv/libs/ts/core/src/lib/resolve/Resolvable.ts`

 NOTE: There was a kind of subtle bug in the original implementation (caught before it ever was used because [tests](./lazy.test.ts), yay).
 *
 Because of distributive conditional types, `Lazy<boolean>` was actually being expanded to `true | false | (() => true) | (() => false)`. This caused a compile-time error when resolving a value like `() => user.name === 'Amy' because `() => boolean` didn't match any of the 4 types TS was looking for.

 The (weird) fix was to change `T` to `[T]` which [disables distributivity](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types).
 */

import type { LazyType } from './LazyType.ts';

// eslint-disable-next-line @typescript-eslint/ban-types
// deno-lint-ignore ban-types
export type Lazy<T extends LazyType> = [T] extends Function ? never
  : T | (() => T);
