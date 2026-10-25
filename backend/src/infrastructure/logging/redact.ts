const SECRET_KEYS = ['passphrase', 'password', 'token', 'authorization', 'cookie'];

export function redactValue(value: any, secrets: string[] = []): any {
  if (typeof value === 'string') {
    let out = value;
    for (const s of secrets) {
      if (s) out = out.split(s).join('[redacted]');
    }
    return out;
  }
  if (Array.isArray(value)) return value.map((v) => redactValue(v, secrets));
  if (value instanceof Date) return value;
  if (value && typeof value === 'object' && value.constructor === Object) {
    const out: any = {};
    for (const [k, v] of Object.entries(value)) {
      if (SECRET_KEYS.includes(k.toLowerCase())) out[k] = '[redacted]';
      else out[k] = redactValue(v, secrets);
    }
    return out;
  }
  return value;
}
