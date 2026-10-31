export type AlgorithmId = "aes-gcm" | "aes-cbc" | "rsa-oaep" | "sha-256" | "base64" | "cesar" | "vigenere";

export type Detail = { label: string; value: string };

export type EncryptOptions = { shift?: number; keyword?: string };

export type EncryptResult = { output: string; details: Detail[]; decrypt?: () => Promise<string> };

export type Algorithm = {
  id: AlgorithmId;
  name: string;
  kind: "Criptografia simétrica" | "Criptografia assimétrica" | "Hash" | "Codificação" | "Cifra clássica";
  safety: "Seguro" | "Não é criptografia" | "Inseguro";
  summary: string[];
  encrypt(text: string, options: EncryptOptions): Promise<EncryptResult>;
};
