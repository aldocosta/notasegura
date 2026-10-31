import { toBase64, utf8Decode, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { getSubtle, randomBytes } from "./web-crypto";

const CURVE = { name: "ECDH", namedCurve: "P-256" };
const SECRET_BITS = 256;
const IV_BYTES = 12;

async function sharedSecret(privateKey: CryptoKey, publicKey: CryptoKey): Promise<Uint8Array<ArrayBuffer>> {
  return new Uint8Array(await getSubtle().deriveBits({ name: "ECDH", public: publicKey }, privateKey, SECRET_BITS));
}

function aesKey(secret: Uint8Array<ArrayBuffer>, usage: KeyUsage): Promise<CryptoKey> {
  return getSubtle().importKey("raw", secret, "AES-GCM", false, [usage]);
}

export async function encrypt(text: string): Promise<EncryptResult> {
  const subtle = getSubtle();
  const ana = (await subtle.generateKey(CURVE, true, ["deriveBits"])) as CryptoKeyPair;
  const beto = (await subtle.generateKey(CURVE, true, ["deriveBits"])) as CryptoKeyPair;
  const anaSecret = await sharedSecret(ana.privateKey, beto.publicKey);
  const betoSecret = await sharedSecret(beto.privateKey, ana.publicKey);
  const iv = randomBytes(IV_BYTES);
  const params = { name: "AES-GCM", iv };
  const ciphertext = await subtle.encrypt(params, await aesKey(anaSecret, "encrypt"), utf8Encode(text));
  const anaPublic = new Uint8Array(await subtle.exportKey("raw", ana.publicKey));
  const betoPublic = new Uint8Array(await subtle.exportKey("raw", beto.publicKey));

  return {
    output: toBase64(new Uint8Array(ciphertext)),
    details: [
      { label: "Chave pública de Ana", value: toBase64(anaPublic) },
      { label: "Chave pública de Beto", value: toBase64(betoPublic) },
      { label: "Segredo calculado por Ana", value: toBase64(anaSecret) },
      { label: "Segredo calculado por Beto", value: toBase64(betoSecret) },
      { label: "IV", value: toBase64(iv) },
    ],
    decrypt: async () =>
      utf8Decode(new Uint8Array(await subtle.decrypt(params, await aesKey(betoSecret, "decrypt"), ciphertext))),
  };
}
