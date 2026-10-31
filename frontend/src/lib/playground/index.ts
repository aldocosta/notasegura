import * as aesCbc from "./aes-cbc";
import * as aesGcm from "./aes-gcm";
import * as base64 from "./base64";
import * as cesar from "./cesar";
import * as rsaOaep from "./rsa-oaep";
import * as sha256 from "./sha-256";
import type { Algorithm } from "./types";
import * as vigenere from "./vigenere";

export const ALGORITHMS: Algorithm[] = [
  {
    id: "aes-gcm",
    name: "AES-256-GCM",
    kind: "Criptografia simétrica",
    safety: "Seguro",
    summary: [
      "Padrão moderno de criptografia simétrica: a mesma chave cifra e decifra. O modo GCM também detecta se o texto cifrado foi alterado. É o algoritmo que o Nota Segura - BR usa para proteger as notas.",
    ],
    encrypt: aesGcm.encrypt,
  },
  {
    id: "aes-cbc",
    name: "AES-256-CBC",
    kind: "Criptografia simétrica",
    safety: "Seguro",
    summary: [
      "Usa o mesmo AES, mas encadeia os blocos com um vetor de inicialização (IV). Ainda é seguro quando bem usado, mas sozinho não detecta alterações no texto cifrado.",
    ],
    encrypt: aesCbc.encrypt,
  },
  {
    id: "rsa-oaep",
    name: "RSA-OAEP",
    kind: "Criptografia assimétrica",
    safety: "Seguro",
    summary: [
      "Criptografia assimétrica: a chave pública cifra e só a chave privada decifra. É usada para proteger chaves curtas, como uma chave AES, e só cifra textos curtos. Para assinar dados, o RSA usa outro preenchimento, o PSS.",
    ],
    encrypt: rsaOaep.encrypt,
  },
  {
    id: "sha-256",
    name: "SHA-256",
    kind: "Hash",
    safety: "Não é criptografia",
    summary: [
      "Gera uma impressão digital de tamanho fixo do texto. O mesmo texto sempre gera o mesmo hash, mas não é possível voltar ao texto original.",
    ],
    encrypt: sha256.encrypt,
  },
  {
    id: "base64",
    name: "Base64",
    kind: "Codificação",
    safety: "Não é criptografia",
    summary: [
      "Transforma bytes em letras e números para transporte. Não usa chave: qualquer pessoa desfaz a codificação, então não protege nada.",
    ],
    encrypt: base64.encrypt,
  },
  {
    id: "cesar",
    name: "Cifra de César",
    kind: "Cifra clássica",
    safety: "Inseguro",
    summary: [
      "Desloca cada letra um número fixo de posições no alfabeto. Usada na Roma antiga, é quebrada em segundos testando os 25 deslocamentos.",
    ],
    encrypt: cesar.encrypt,
  },
  {
    id: "vigenere",
    name: "Cifra de Vigenère",
    kind: "Cifra clássica",
    safety: "Inseguro",
    summary: [
      "Usa uma palavra-chave para deslocar cada letra de forma diferente. Resistiu por séculos, mas hoje é quebrada facilmente com análise de frequência.",
    ],
    encrypt: vigenere.encrypt,
  },
];
