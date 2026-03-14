declare module "node:http" {
  const http: {
    createServer: (handler: (req: unknown, res: { writeHead: (...args: unknown[]) => void; end: (body: string) => void }) => void) => {
      listen: (port: number, host: string, cb: () => void) => void;
    };
  };
  export default http;
}

declare module "node:test" {
  const test: (name: string, fn: () => void | Promise<void>) => void;
  export default test;
}

declare module "node:assert/strict" {
  const assert: {
    equal: (actual: unknown, expected: unknown) => void;
    ok: (value: unknown) => void;
    throws: (fn: () => unknown) => void;
  };
  export default assert;
}

declare const process: { stdout: { write: (s: string) => void } };
