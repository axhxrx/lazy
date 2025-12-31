/**
 @module @axhxrx/lazy
 
 Provides the `Lazy<T>` type and `lazyval()` function for lazy evaluation.
 
 @example
 ```typescript
 import { Lazy, lazy } from '@axhxrx/lazy';
 
 const config: { timeout: Lazy<number> } = {
   timeout: () => Date.now()
 };
 
 const timeout = lazyval(config.timeout);
 ```
 */

export type { LazyType } from "./LazyType.ts";
export { lazyval } from "./lazyval.ts";
export type { Lazy } from "./types.ts";
