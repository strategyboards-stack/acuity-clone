declare module "node:crypto" {
  export function randomUUID(): string;
}

declare module "node:assert/strict" {
  const assert: {
    equal(actual: unknown, expected: unknown): void;
    rejects(asyncFn: Promise<unknown>, expected?: RegExp): Promise<void>;
  };
  export default assert;
}

declare module "node:test" {
  type TestFn = (name: string, fn: () => void | Promise<void>) => void;
  const test: TestFn;
  export default test;
}
