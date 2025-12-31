import { assertEquals } from '@std/assert';
import { lazyval } from './lazyval.ts';
import type { Lazy } from './types.ts';

Deno.test('lazyval() - should resolve a Lazy<string>', () =>
{
  const hoge = `ほげ`;

  const inputs: Lazy<string>[] = ['a', () => 'a', () => hoge + hoge + hoge];

  const expected = ['a', 'a', 'ほげほげほげ'];

  inputs.forEach((input, i) =>
  {
    assertEquals(lazyval(input), expected[i]);
  });
});

Deno.test('lazyval() - should resolve a Lazy<number>', () =>
{
  const inputs: Lazy<number>[] = [1, () => 1, () => 1 + 1 + 1];

  const expected = [1, 1, 3];

  inputs.forEach((input, i) =>
  {
    assertEquals(lazyval(input), expected[i]);
  });
});

Deno.test('lazyval() - should resolve a Lazy<boolean>', () =>
{
  // The interesting thing about this test is that it exposed a somewhat subtle bug in the initial implementation of `Lazy<T>`. (See the comment in `Lazy<T>` for more details.)

  const utterlyTrue = !!('Hello'.substring(0, 4) === 'Hell');
  const completelyFalse = !utterlyTrue;

  const user = { name: 'Broheem', age: 30 };

  const inputs: Lazy<boolean>[] = [
    true,
    false,
    utterlyTrue,
    completelyFalse,
    () => true,
    () => false,
    () => user.name === 'Broheem',
    () => user.name !== 'Broheem',
  ];

  const expected = [true, false, true, false, true, false, true, false];

  inputs.forEach((input, i) =>
  {
    assertEquals(lazyval(input), expected[i]);
  });
});

Deno.test('lazyval() - should resolve a Lazy<null>', () =>
{
  const inputs: Lazy<null>[] = [null, () => null];

  const expected = [null, null];

  inputs.forEach((input, i) =>
  {
    assertEquals(lazyval(input), expected[i]);
  });
});

Deno.test('lazyval() - should resolve a Lazy<undefined>', () =>
{
  const inputs: Lazy<undefined>[] = [undefined, () => undefined];

  const expected = [undefined, undefined];

  inputs.forEach((input, i) =>
  {
    assertEquals(lazyval(input), expected[i]);
  });
});

Deno.test('lazyval() - should resolve a Lazy<string[]>', () =>
{
  const inputs: Lazy<string[]>[] = [
    ['a', 'b', 'c'],
    () => ['a', 'b', 'c'],
    () => ['a', 'b', 'c'].map((s) => s + s),
  ];

  const expected = [
    ['a', 'b', 'c'],
    ['a', 'b', 'c'],
    ['aa', 'bb', 'cc'],
  ];

  inputs.forEach((input, i) =>
  {
    assertEquals(lazyval(input), expected[i]);
  });
});

Deno.test(
  'lazyval() - should resolve a Lazy<{ name: string; age: number }>',
  () =>
  {
    const user = { name: 'Broheem', age: 30 };

    const inputs: Lazy<{ name: string; age: number }>[] = [
      user,
      structuredClone(user),
      () => user,
      () => structuredClone(user),
    ];

    const expected = [user, user, user, user];

    inputs.forEach((input, i) =>
    {
      assertEquals(lazyval(input), expected[i]);
    });
  },
);

Deno.test(
  'lazyval() - should type error a Lazy<{ name: string; age: number }>',
  () =>
  {
    const user = { name: 'Broheem', age: 'thirty' };

    const inputs: Lazy<{ name: string; age: number }>[] = [
      // @ts-expect-error "Type 'string' is not assignable to type 'number | (() => number)'"
      user,
      // @ts-expect-error "Type 'string' is not assignable to type 'number | (() => number)'"
      structuredClone(user),
      // @ts-expect-error "Type 'string' is not assignable to type 'number | (() => number)'"
      () => user,
      // @ts-expect-error "Type 'string' is not assignable to type 'number | (() => number)'"
      () => structuredClone(user),
    ];

    const expected = [user, user, user, user];

    inputs.forEach((input, i) =>
    {
      // @ts-expect-error "Type 'string' is not assignable to type 'number | (() => number)'"
      assertEquals(lazyval(input), expected[i]);
    });
  },
);

Deno.test(
  'lazyval() - should cause build-time TS errors with invalid types (even though they do work)',
  () =>
  {
    // @ts-expect-error "Type 'string' is not assignable to type 'number | (() => number)'"
    //
    // let a = 1; // if we uncomment this line, we get a TS error, which is what we want, and it does indeed fail the deno test command 👍
    //
    const foo: Lazy<number> = 'bar;';
    assertEquals(lazyval(foo), lazyval(foo));

    // @ts-expect-error "does not satisfy the constraint"
    const bar: Lazy<() => number> = () => 5;
    assertEquals(lazyval(bar), 5);

    const fn = () => 6;
    type fnt = () => number;
    // @ts-expect-error "does not satisfy the constraint"
    const baz: Lazy<fnt> = () => fn;
    // @ts-expect-error "not assignable to type 'LazyType"
    assertEquals(lazyval(baz), fn);
  },
);
