export type AlgorithmId =
  | "aes-gcm"
  | "chacha20-poly1305"
  | "aes-cbc"
  | "aes-ctr"
  | "rsa-oaep"
  | "sha-256"
  | "sha-512"
  | "sha-1"
  | "md5"
  | "hmac-sha-256"
  | "ecdsa"
  | "ed25519"
  | "rsa-pss"
  | "ecdh"
  | "pbkdf2"
  | "base64"
  | "cesar"
  | "vigenere";

export type AlgorithmKind =
  | "Criptografia simétrica"
  | "Criptografia assimétrica"
  | "Hash"
  | "Autenticação de mensagem"
  | "Assinatura digital"
  | "Troca de chaves"
  | "Derivação de chave"
  | "Codificação"
  | "Cifra clássica";

export type Detail = { label: string; value: string };

export type EncryptOptions = { shift?: number; keyword?: string };

export type EncryptResult = {
  output: string;
  details: Detail[];
  decrypt?: () => Promise<string>;
  verify?: (text: string) => Promise<boolean>;
};

export type Algorithm = {
  id: AlgorithmId;
  name: string;
  kind: AlgorithmKind;
  safety: "Seguro" | "Não é criptografia" | "Inseguro";
  summary: string[];
  encrypt(text: string, options: EncryptOptions): Promise<EncryptResult>;
};
