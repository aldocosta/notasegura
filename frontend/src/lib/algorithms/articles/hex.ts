import type { Article } from "../types";

export const hex: Article = {
  id: "hex",
  description:
    "O que é a codificação hexadecimal, como cada byte vira dois símbolos, onde ela aparece (hashes, cores, endereços) e por que não protege nada.",
  lead: "A forma mais comum de mostrar bytes para pessoas: dois símbolos para cada byte, de 00 a ff.",
  highlights: {
    kind: "Só muda o formato dos dados, sem esconder nada.",
    safety: "Não protege um segredo: qualquer pessoa decodifica.",
    key: "Não usa chave. A tabela de 16 símbolos é pública.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "Hexadecimal é o sistema de numeração de base 16. Ele usa os dígitos de 0 a 9 e as letras de a até f, que valem de 10 a 15. Como codificação, ele transforma bytes em texto: cada byte vira exatamente dois símbolos hexadecimais.",
        "Assim como o Base64, o hexadecimal não é criptografia. Ele não usa chave e a regra é pública. A diferença é o objetivo: o Base64 economiza espaço, e o hexadecimal facilita a leitura por pessoas.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "Um byte tem 8 bits e pode valer de 0 a 255. Cada símbolo hexadecimal representa 4 bits, então dois símbolos representam um byte inteiro: 00 é 0, 0f é 15, 10 é 16 e ff é 255.",
        "Para codificar um texto, primeiro ele é transformado em bytes, em geral com UTF-8, e depois cada byte vira dois símbolos. Por isso, o resultado tem o dobro do tamanho em bytes do texto original, mais do que o aumento de cerca de um terço do Base64.",
        "Para decodificar, basta ler os símbolos de dois em dois e transformar cada par de volta em um byte.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha Hexadecimal e digite \"olá\". O resultado é 6f6cc3a1. A letra o vira 6f, a letra l vira 6c e a letra á, que ocupa 2 bytes em UTF-8, vira c3a1.",
        "Clique em \"Decodificar\" e a palavra volta, sem nenhuma chave. Repare que os mesmos 4 bytes viram 8 caracteres em hexadecimal e 8 caracteres em Base64 (b2zDoQ==), mas o Base64 fica proporcionalmente menor em textos maiores.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O hexadecimal aparece sempre que pessoas precisam ler ou comparar bytes:",
      ],
      items: [
        "O resultado de um hash, como os 64 símbolos do SHA-256.",
        "Chaves, identificadores e valores em registros de sistemas.",
        "Cores em CSS, como #ff0000 para vermelho: um byte para cada cor primária.",
        "Endereços MAC de placas de rede e endereços IPv6.",
        "Códigos de caracteres Unicode, como U+00E1 para a letra á.",
        "Ferramentas que mostram o conteúdo de arquivos e da memória.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é simples, sem perdas, fácil de ler e de comparar, e cada byte fica alinhado com dois símbolos, o que ajuda na depuração.",
        "Pontos fracos: dobra o tamanho dos dados, mais do que o Base64. E, como toda codificação, não protege nada: um texto em hexadecimal parece técnico, mas qualquer pessoa ou ferramenta o decodifica na hora.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o hexadecimal para mostrar hashes, chaves e bytes para pessoas, em registros e em interfaces de depuração. Para transportar dados binários grandes em texto, prefira o Base64, que ocupa menos espaço.",
        "Nunca use o hexadecimal para esconder uma senha ou um dado pessoal. Se a informação é secreta, cifre primeiro com um algoritmo como o AES-256-GCM.",
      ],
    },
  ],
  related: ["base64", "sha-256"],
};
