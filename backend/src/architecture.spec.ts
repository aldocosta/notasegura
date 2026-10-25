import * as fs from 'fs';
import * as path from 'path';

const SRC = path.resolve(__dirname);

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.isFile() && entry.name.endsWith('.ts')) out.push(full);
  }
  return out;
}

function rel(file: string): string {
  return path.relative(SRC, file).replace(/\\/g, '/');
}

function importsOf(file: string): string[] {
  const text = fs.readFileSync(file, 'utf8');
  const out: string[] = [];
  const re = /import\s+(?:type\s+)?(?:[\w*{}\s,]+\s+from\s+)?['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) out.push(m[1]);
  return out;
}

const HTTP_SYMBOLS = [
  'HttpException',
  'NotFoundException',
  'UnauthorizedException',
  'BadRequestException',
];

const HTTP_DECORATORS = [
  'Controller',
  'Get',
  'Post',
  'Put',
  'Delete',
  'Patch',
  'Options',
  'Head',
  'All',
  'Body',
  'Param',
  'Query',
  'Headers',
  'Req',
  'Res',
];

describe('architecture', () => {
  it('keeps business capabilities under src/modules', () => {
    const entries = fs.readdirSync(SRC, { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        expect(['modules', 'platform']).toContain(e.name);
      }
    }
  });

  it('has no root layer directories', () => {
    for (const name of [
      'domain',
      'application',
      'infrastructure',
      'presentation',
    ]) {
      expect(fs.existsSync(path.join(SRC, name))).toBe(false);
    }
  });

  it('keeps platform independent of business modules', () => {
    const platformFiles = walk(path.join(SRC, 'platform'));
    for (const f of platformFiles) {
      for (const imp of importsOf(f)) {
        expect(imp).not.toMatch(/modules\//);
      }
    }
  });

  it('enforces inward dependency direction', () => {
    const modulesDir = path.join(SRC, 'modules');
    for (const mod of fs.readdirSync(modulesDir)) {
      const domainDir = path.join(modulesDir, mod, 'domain');
      const appDir = path.join(modulesDir, mod, 'application');
      for (const f of walk(domainDir)) {
        for (const imp of importsOf(f)) {
          if (imp.startsWith('.')) {
            const resolved = path.resolve(path.dirname(f), imp);
            const relPath = path
              .relative(domainDir, resolved)
              .replace(/\\/g, '/');
            expect(relPath).not.toMatch(
              /^(application|infrastructure|presentation)/,
            );
          }
        }
      }
      for (const f of walk(appDir)) {
        for (const imp of importsOf(f)) {
          if (imp.startsWith('.')) {
            const resolved = path.resolve(path.dirname(f), imp);
            const relPath = path.relative(appDir, resolved).replace(/\\/g, '/');
            expect(relPath).not.toMatch(/^(infrastructure|presentation)/);
          }
        }
      }
    }
  });

  it('forbids deep imports across modules', () => {
    const modulesDir = path.join(SRC, 'modules');
    const moduleNames = fs.readdirSync(modulesDir);
    for (const mod of moduleNames) {
      const files = walk(path.join(modulesDir, mod));
      for (const f of files) {
        for (const imp of importsOf(f)) {
          const m = imp.match(
            /modules\/([^/]+)\/(domain|application|infrastructure|presentation)/,
          );
          if (m && m[1] !== mod) {
            throw new Error(`${rel(f)} deep-imports ${imp}`);
          }
        }
      }
    }
  });

  it('forbids HTTP symbols in domain and application', () => {
    const modulesDir = path.join(SRC, 'modules');
    for (const mod of fs.readdirSync(modulesDir)) {
      for (const layer of ['domain', 'application']) {
        const dir = path.join(modulesDir, mod, layer);
        for (const f of walk(dir)) {
          const text = fs.readFileSync(f, 'utf8');
          for (const sym of [...HTTP_SYMBOLS, ...HTTP_DECORATORS]) {
            const re = new RegExp(`\\b${sym}\\b`);
            // only check import lines
            for (const line of text.split('\\n')) {
              if (/^\s*import\b/.test(line) && re.test(line)) {
                throw new Error(`${rel(f)} imports HTTP symbol ${sym}`);
              }
            }
          }
        }
      }
    }
  });

  it('keeps one module file per module directory', () => {
    const modulesDir = path.join(SRC, 'modules');
    for (const mod of fs.readdirSync(modulesDir)) {
      const root = path.join(modulesDir, mod);
      const moduleFiles = fs
        .readdirSync(root)
        .filter((n) => n.endsWith('.module.ts'));
      expect(moduleFiles.length).toBe(1);
    }
  });

  it('registers APP_INTERCEPTOR exactly once', () => {
    const files = walk(SRC);
    let count = 0;
    for (const f of files) {
      const text = fs.readFileSync(f, 'utf8');
      if (text.includes('APP_INTERCEPTOR')) count += 1;
    }
    expect(count).toBe(1);
  });
});
