import { redactValue } from './redact';
describe('redact', () => {
  it('removes secrets', () => {
    const rec: any = { message: 'passphrase=secret noteId=abc plaintext=hello ?q=1' };
    const out = redactValue(rec, ['secret','abc','hello','?q=1']) as any;
    expect(JSON.stringify(out)).not.toContain('secret');
    expect(JSON.stringify(out)).not.toContain('abc');
    expect(JSON.stringify(out)).not.toContain('hello');
    expect(JSON.stringify(out)).not.toContain('?q=1');
  });
});
