import type { Article } from "../types";

export const aesGcm: Article = {
  id: "aes-gcm",
  description:
    "Como funciona o AES-256-GCM, o padrão de criptografia que protege o HTTPS e as notas do Nota Segura - BR, com exemplo e cuidados de uso.",
  lead: "O padrão moderno para cifrar dados com uma chave secreta, e o algoritmo que protege cada nota deste site.",
  highlights: {
    kind: "A mesma chave secreta cifra e decifra o texto.",
    safety: "É seguro quando a chave fica secreta e o IV nunca se repete.",
    key: "Uma chave aleatória de 256 bits, mostrada com 44 caracteres em Base64.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "O AES (Advanced Encryption Standard) é o algoritmo de criptografia simétrica mais usado no mundo. Simétrica quer dizer que a mesma chave serve para cifrar e para decifrar. Quem não tem a chave vê apenas bytes que parecem aleatórios.",
        "O algoritmo nasceu como Rijndael, criado pelos belgas Joan Daemen e Vincent Rijmen. Ele venceu um concurso público organizado pelo NIST, o instituto de padrões dos Estados Unidos, e virou o padrão FIPS 197 em 2001. Desde então, pesquisadores do mundo inteiro tentam quebrá-lo, e nenhum ataque prático contra o AES completo foi encontrado.",
        "O número 256 indica o tamanho da chave em bits. GCM (Galois/Counter Mode) é o modo de operação: a forma como o AES é aplicado a um texto de qualquer tamanho. O GCM cifra e, ao mesmo tempo, garante que o texto cifrado não foi alterado.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "O AES trabalha com blocos de 128 bits (16 bytes). Com uma chave de 256 bits, cada bloco passa por 14 rodadas de substituições, permutações e misturas com partes da chave. O resultado de cada bloco depende de todos os bits da chave.",
        "O modo GCM usa o AES como um gerador de fluxo. Ele cifra um contador que começa no IV (vetor de inicialização) e combina o resultado com o texto usando a operação XOR. Por isso, o texto cifrado tem o mesmo tamanho do texto original.",
        "Em paralelo, o GCM calcula uma etiqueta de autenticação, chamada tag, de 16 bytes. Na hora de decifrar, a tag é conferida antes de tudo. Se um único bit do texto cifrado, do IV ou da tag mudou, ou se a chave está errada, a operação falha. O resultado nunca é um texto trocado em silêncio.",
      ],
      items: [
        "Chave: 256 bits aleatórios, que precisam ficar secretos.",
        "IV: 12 bytes aleatórios, que podem ser públicos, mas nunca podem se repetir com a mesma chave.",
        "Tag: 16 bytes que provam que nada foi alterado.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "Escolha AES-256-GCM no playground desta página e cifre a palavra \"segredo\". Ela tem 7 bytes em UTF-8. O resultado tem 23 bytes: 7 bytes de texto cifrado mais 16 bytes da tag. Em Base64, isso aparece como 32 caracteres.",
        "O playground também mostra a chave, com 44 caracteres em Base64, e o IV, com 16. Clique em \"Encriptar\" de novo: a chave e o IV mudam, e o resultado fica completamente diferente, mesmo com o mesmo texto. Clique em \"Decifrar\" e a palavra \"segredo\" volta, porque a chave certa e a tag conferem.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O AES-GCM protege grande parte da internet. Ele é uma das opções principais do HTTPS com TLS 1.3, o cadeado do navegador. Também aparece no SSH, em VPNs IPsec e em muitos aplicativos de mensagens e de armazenamento.",
        "O Nota Segura - BR usa o AES-256-GCM para cada nota. Cada nota recebe um IV novo e um sal novo, e a chave de 256 bits é derivada com scrypt a partir da frase secreta. Quando você não define uma frase, o servidor usa uma frase padrão própria. Se a frase estiver errada, a tag não confere e a nota não é exibida.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é rápido, porque a maioria dos processadores tem instruções próprias para o AES. Ele cifra e autentica em uma só operação, e é estudado há mais de vinte anos. Uma chave de 256 bits não pode ser descoberta por tentativa e erro, nem com todos os computadores do mundo.",
        "Pontos fracos: a segurança depende do IV. Se o mesmo IV for usado duas vezes com a mesma chave, um atacante consegue combinar os dois textos cifrados, descobrir partes dos textos e até forjar mensagens. O GCM também não esconde o tamanho do texto. E, como em toda criptografia simétrica, o difícil é entregar a chave ao destinatário sem que outra pessoa a veja.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o AES-256-GCM sempre que precisar guardar ou enviar dados que só quem tem a chave pode ler, e quando quiser saber se alguém alterou esses dados. Use uma biblioteca conhecida, como a Web Crypto do navegador ou a biblioteca de criptografia da sua linguagem, e nunca escreva o algoritmo do zero.",
        "Gere um IV aleatório para cada mensagem e guarde-o junto com o texto cifrado. Para transformar uma senha em chave, use uma função de derivação lenta, como scrypt ou Argon2. Para combinar uma chave com alguém pela internet, use criptografia assimétrica, como o RSA-OAEP, e depois use o AES para os dados.",
      ],
    },
  ],
  related: ["aes-cbc", "rsa-oaep"],
  publishedAt: "2026-10-30",
};
