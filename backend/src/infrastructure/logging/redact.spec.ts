import { redactValue } from './redact';
describe('redact', () => {
  it('removes secrets', () => {
    const rec: Record<string, unknown> = {
      message: 'passphrase=secret noteId=abc plaintext=hello ?q=1',
    };
    const out = redactValue(rec, ['secret', 'abc', 'hello', '?q=1']);
    expect(JSON.stringify(out)).not.toContain('secret');
    expect(JSON.stringify(out)).not.toContain('abc');
    expect(JSON.stringify(out)).not.toContain('hello');
    expect(JSON.stringify(out)).not.toContain('?q=1');
  });
});
