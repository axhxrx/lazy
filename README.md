# @axhxrx/lazy

Type-safe lazy evaluation for TypeScript.

(Migrated from `axhxrx-mmxxv/libs/ts/core/src/lib/resolve/` on 2025-12-31.)

## Usage

The `Lazy<T>` type allows values to be either direct values or functions that return values:

```typescript
import { Lazy, lazy } from "@axhxrx/lazy";

// Configuration with mixed static and dynamic values
const config: {
  apiKey: Lazy<string>;
  timestamp: Lazy<number>;
  debug: Lazy<boolean>;
} = {
  apiKey: "static-key-123", // static value
  timestamp: () => Date.now(), // computed each time
  debug: () => Deno.env.get("DEBUG") === "true", // context-dependent
};

// Resolve values when needed
const apiKey = lazy(config.apiKey); // 'static-key-123'
const timestamp = lazy(config.timestamp); // current timestamp
const debug = lazy(config.debug); // boolean from env
```

## Why?

TypeScript doesn't support `T | (() => T)` naturally because it can't narrow `typeof value === 'function'` to prove the function returns `T`. This library provides a workaround with proper type safety.

See the [TypeScript issue #37663](https://github.com/microsoft/TypeScript/issues/37663) for more details.

## License

MIT

---

🤖 2025-12-31: repo initialized by Bottie McBotface bot@axhxrx.com
