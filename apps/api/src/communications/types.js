export class StubResult {
  static ok() {
    return { ok: true };
  }

  static fail(code, message) {
    return { ok: false, code, message };
  }
}
