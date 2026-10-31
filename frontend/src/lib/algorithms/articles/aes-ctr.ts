import type { Article } from "../types";

export const aesCtr: Article = {
  id: "aes-ctr",
  description:
    "Como funciona o AES-256-CTR, o modo contador que transforma o AES em cifra de fluxo, por que ele não detecta alterações e como o GCM resolve.",
  lead: "O AES no modo contador: rápido, sem preenchimento e com o resultado do mesmo tamanho do texto, mas sem proteção contra alterações.",
  highlights: {
    kind: "A mesma chave secreta cifra e decifra o texto.",
    safety: "É seguro para sigilo quando o contador nunca se repete, mas precisa de verificação extra.",
    key: "Uma chave aleatória de 256 bits e um bloco de contador de 16 bytes.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "AES-256-CTR é o algoritmo AES, com chave de 256 bits, usado no modo CTR, ou modo contador. O modo foi proposto por Whitfield Diffie e Martin Hellman em 1979 e transforma uma cifra de blocos em uma cifra de fluxo.",
        "Em vez de cifrar o texto diretamente, o AES cifra um contador. O resultado funciona como uma sequência de bytes que parece aleatória, e essa sequência é combinada com o texto. O modo é a base do GCM, que acrescenta a autenticação.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "O ponto de partida é um bloco de contador de 16 bytes. Parte dele funciona como um valor único da mensagem, e a outra parte é o contador propriamente dito, que aumenta de 1 em 1. O AES cifra o primeiro bloco de contador, depois o segundo, e assim por diante.",
        "Cada bloco cifrado é combinado com 16 bytes do texto usando a operação XOR. Para decifrar, basta gerar a mesma sequência e aplicar XOR de novo. Por isso, o resultado tem o mesmo tamanho do texto e não precisa de preenchimento.",
      ],
      items: [
        "Os blocos são independentes, então podem ser processados em paralelo.",
        "É possível decifrar só um trecho do meio, sem passar pelo começo.",
        "O mesmo contador nunca pode ser usado duas vezes com a mesma chave.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha AES-256-CTR e cifre \"segredo\". O resultado tem exatamente 7 bytes, o mesmo tamanho da palavra, ao contrário do AES-CBC, que completa até 16 bytes. O playground usa um bloco de contador aleatório de 16 bytes, em que os últimos 64 bits funcionam como contador.",
        "Clique em \"Decifrar\" e a palavra volta. Repare que não existe tag: nada no resultado prova que o texto cifrado está intacto.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O modo contador está dentro do AES-GCM, que é CTR com autenticação. Sozinho, ele aparece em protocolos que cuidam da integridade de outra forma, como o SRTP, usado em chamadas de voz e vídeo, que combina o AES-CTR com um HMAC. Ele também aparece em geradores de números aleatórios, como o CTR_DRBG do NIST.",
        "Quando é usado sozinho em um sistema bem projetado, ele vem acompanhado de um HMAC calculado sobre o texto cifrado, para detectar alterações.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é simples, rápido, paralelo e não tem ataques de preenchimento, porque não usa preenchimento. Com um contador que nunca se repete, um atacante que só observa o texto cifrado não aprende nada sobre o texto.",
        "Pontos fracos: não há integridade. Se um atacante inverte um bit do texto cifrado, o mesmo bit é invertido no texto decifrado, sem nenhum aviso. Se ele sabe que uma mensagem diz \"valor: 100\", pode mudá-la para \"valor: 900\" sem conhecer a chave. E se o contador se repetir com a mesma chave, a combinação dos dois textos cifrados revela a combinação dos dois textos originais.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Em um projeto novo, prefira o GCM ou o ChaCha20-Poly1305, que já incluem a autenticação. Use o CTR sozinho apenas quando um formato existente exige esse modo, ou quando a integridade é garantida por outro mecanismo.",
        "Se usar o CTR, nunca repita um bloco de contador com a mesma chave, calcule um HMAC sobre o texto cifrado com uma chave separada e confira o HMAC antes de decifrar.",
      ],
    },
  ],
  related: ["aes-gcm", "chacha20-poly1305"],
};
