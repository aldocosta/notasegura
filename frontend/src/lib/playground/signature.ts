import { toBase64, utf8Encode } from "./bytes";
import type { EncryptResult } from "./types";
import { generateOrUnsupported, getSubtle } from "./web-crypto";

type SignatureParams = {
  generate: RsaHashedKeyGenParams | EcKeyGenParams | Algorithm;
  sign: RsaPssParams | EcdsaParams | Algorithm;
  publicKeyFormat: "spki" | "raw";
};

export async function signAndShow(text: string, params: SignatureParams): Promise<EncryptResult> {
  const subtle = getSubtle();
  const pair = (await generateOrUnsupported(() => subtle.generateKey(params.generate, true, ["sign", "verify"]))) as CryptoKeyPair;
  const signature = await subtle.sign(params.sign, pair.privateKey, utf8Encode(text));
  const publicKey = new Uint8Array(await subtle.exportKey(params.publicKeyFormat, pair.publicKey));

  return {
    output: toBase64(new Uint8Array(signature)),
    details: [{ label: "Chave pública", value: toBase64(publicKey) }],
    verify: (candidate) => subtle.verify(params.sign, pair.publicKey, signature, utf8Encode(candidate)),
  };
}
