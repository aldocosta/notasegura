const SECRET_KEYS = [
  'passphrase',
  'password',
  'token',
  'authorization',
  'cookie',
];

export function redactValue(value: unknown, secrets: string[] = []): unknown {
  if (typeof value === 'string') {
    let out = value;
    for (const s of secrets) {
      if (s) out = out.split(s).join('[redacted]');
    }
    return out;
  }
  if (Array.isArray(value)) {
    return (value as unknown[]).map((v) => redactValue(v, secrets));
  }
  if (value instanceof Date) return value;
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (obj.constructor === Object) {
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (SECRET_KEYS.includes(k.toLowerCase())) {
          out[k] = '[redacted]';
        } else {
          out[k] = redactValue(v, secrets);
        }
      }
      return out;
    }
  }
  return value;
}
