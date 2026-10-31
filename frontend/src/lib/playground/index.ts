import * as aesCbc from "./aes-cbc";
import * as aesCtr from "./aes-ctr";
import * as aesGcm from "./aes-gcm";
import * as atbash from "./atbash";
import * as base64 from "./base64";
import * as cesar from "./cesar";
import * as chacha20Poly1305 from "./chacha20-poly1305";
import * as ecdh from "./ecdh";
import * as ecdsa from "./ecdsa";
import * as ed25519 from "./ed25519";
import * as enigma from "./enigma";
import * as hex from "./hex";
import * as hmacSha256 from "./hmac-sha-256";
import * as md5 from "./md5";
import * as pbkdf2 from "./pbkdf2";
import * as playfair from "./playfair";
import * as railFence from "./rail-fence";
import * as rot13 from "./rot13";
import * as rsaOaep from "./rsa-oaep";
import * as rsaPss from "./rsa-pss";
import * as sha1 from "./sha-1";
import * as sha256 from "./sha-256";
import * as sha512 from "./sha-512";
import type { Algorithm } from "./types";
import * as vernam from "./vernam";
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
    id: "chacha20-poly1305",
    name: "ChaCha20-Poly1305",
    kind: "Criptografia simétrica",
    safety: "Seguro",
    summary: [
      "Cifra moderna de fluxo com autenticação, criada para ser rápida mesmo sem aceleração de hardware. Como o AES-GCM, detecta se o texto cifrado foi alterado. É usada no TLS 1.3, no WireGuard e no SSH.",
    ],
    encrypt: chacha20Poly1305.encrypt,
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
    id: "aes-ctr",
    name: "AES-256-CTR",
    kind: "Criptografia simétrica",
    safety: "Seguro",
    summary: [
      "Transforma o AES em uma cifra de fluxo: cifra um contador e combina o resultado com o texto. O resultado tem o mesmo tamanho do texto, mas o modo não detecta alterações.",
    ],
    encrypt: aesCtr.encrypt,
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
    id: "sha-512",
    name: "SHA-512",
    kind: "Hash",
    safety: "Não é criptografia",
    summary: [
      "Hash da mesma família do SHA-256, com resultado de 512 bits. É usado em assinaturas Ed25519 e em hashes de senhas do Linux. Como todo hash, não pode ser desfeito.",
    ],
    encrypt: sha512.encrypt,
  },
  {
    id: "sha-1",
    name: "SHA-1",
    kind: "Hash",
    safety: "Inseguro",
    summary: [
      "Hash de 160 bits muito usado no passado. Em 2017, pesquisadores criaram dois arquivos diferentes com o mesmo SHA-1, e ele deixou de ser seguro.",
    ],
    encrypt: sha1.encrypt,
  },
  {
    id: "md5",
    name: "MD5",
    kind: "Hash",
    safety: "Inseguro",
    summary: [
      "Hash de 128 bits dos anos 1990. Hoje é fácil criar dois textos com o mesmo MD5, então ele não serve para segurança, só para detectar erros de cópia.",
    ],
    encrypt: md5.encrypt,
  },
  {
    id: "hmac-sha-256",
    name: "HMAC-SHA-256",
    kind: "Autenticação de mensagem",
    safety: "Seguro",
    summary: [
      "Combina uma chave secreta com o SHA-256 para gerar um código de autenticação. Quem tem a chave confere se a mensagem veio de quem também tem a chave e se não mudou.",
    ],
    encrypt: hmacSha256.encrypt,
  },
  {
    id: "ecdsa",
    name: "ECDSA",
    kind: "Assinatura digital",
    safety: "Seguro",
    summary: [
      "Assinatura digital com curvas elípticas: a chave privada assina e a chave pública confere. É usada em certificados HTTPS, em passkeys e no Bitcoin.",
    ],
    encrypt: ecdsa.encrypt,
  },
  {
    id: "ed25519",
    name: "Ed25519",
    kind: "Assinatura digital",
    safety: "Seguro",
    summary: [
      "Assinatura digital moderna em curvas de Edwards, rápida e com chaves de 32 bytes. Não depende de um número aleatório a cada assinatura, o que evita um erro comum do ECDSA.",
    ],
    encrypt: ed25519.encrypt,
  },
  {
    id: "rsa-pss",
    name: "RSA-PSS",
    kind: "Assinatura digital",
    safety: "Seguro",
    summary: [
      "Assinatura digital com RSA e um preenchimento aleatório. É o formato que o TLS 1.3 exige para assinaturas RSA.",
    ],
    encrypt: rsaPss.encrypt,
  },
  {
    id: "ecdh",
    name: "ECDH",
    kind: "Troca de chaves",
    safety: "Seguro",
    summary: [
      "Troca de chaves Diffie-Hellman com curvas elípticas. Ana e Beto trocam apenas chaves públicas e chegam ao mesmo segredo, que vira uma chave AES.",
    ],
    encrypt: ecdh.encrypt,
  },
  {
    id: "pbkdf2",
    name: "PBKDF2",
    kind: "Derivação de chave",
    safety: "Seguro",
    summary: [
      "Transforma uma senha em uma chave, repetindo o HMAC centenas de milhares de vezes com um sal. Isso torna cada tentativa de adivinhar a senha mais lenta.",
    ],
    encrypt: pbkdf2.encrypt,
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
    id: "hex",
    name: "Hexadecimal",
    kind: "Codificação",
    safety: "Não é criptografia",
    summary: [
      "Escreve cada byte com dois símbolos de 0 a 9 e de a até f. É muito usado para mostrar hashes e chaves. Não usa chave, então não protege nada.",
    ],
    encrypt: hex.encrypt,
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
    id: "rot13",
    name: "ROT13",
    kind: "Cifra clássica",
    safety: "Inseguro",
    summary: [
      "É a Cifra de César com deslocamento 13. Como o alfabeto tem 26 letras, aplicar o ROT13 duas vezes devolve o texto original.",
    ],
    encrypt: rot13.encrypt,
  },
  {
    id: "atbash",
    name: "Cifra Atbash",
    kind: "Cifra clássica",
    safety: "Inseguro",
    summary: [
      "Troca a primeira letra do alfabeto pela última, a segunda pela penúltima, e assim por diante. Vem do alfabeto hebraico e não tem chave.",
    ],
    encrypt: atbash.encrypt,
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
  {
    id: "playfair",
    name: "Cifra de Playfair",
    kind: "Cifra clássica",
    safety: "Inseguro",
    summary: [
      "Cifra pares de letras com uma grade de 5 por 5 montada a partir de uma palavra-chave. Foi usada por militares britânicos, mas cai com a análise de frequência dos pares.",
    ],
    encrypt: playfair.encrypt,
  },
  {
    id: "rail-fence",
    name: "Cerca de trilho",
    kind: "Cifra clássica",
    safety: "Inseguro",
    summary: [
      "Não troca nenhuma letra: escreve o texto em zigue-zague em alguns trilhos e lê trilho por trilho. É uma cifra de transposição, fácil de quebrar testando poucos números de trilhos.",
    ],
    encrypt: railFence.encrypt,
  },
  {
    id: "enigma",
    name: "Máquina Enigma",
    kind: "Cifra clássica",
    safety: "Inseguro",
    summary: [
      "Máquina alemã da Segunda Guerra Mundial, com rotores que mudam a substituição a cada letra. Foi quebrada por matemáticos poloneses e britânicos, entre eles Alan Turing.",
    ],
    encrypt: enigma.encrypt,
  },
  {
    id: "vernam",
    name: "Cifra de Vernam",
    kind: "Cifra clássica",
    safety: "Seguro",
    summary: [
      "Combina o texto com uma chave aleatória do mesmo tamanho, usada uma única vez. Bem usada, é impossível de quebrar, mas é difícil entregar uma chave tão grande ao destinatário.",
    ],
    encrypt: vernam.encrypt,
  },
];
