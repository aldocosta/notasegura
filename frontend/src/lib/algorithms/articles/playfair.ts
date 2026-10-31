import type { Article } from "../types";

export const playfair: Article = {
  id: "playfair",
  description:
    "Como funciona a Cifra de Playfair, criada por Wheatstone em 1854, com uma grade 5x5 e pares de letras, e por que ela foi quebrada.",
  lead: "Em vez de trocar uma letra de cada vez, a Playfair troca pares de letras com uma grade montada a partir de uma palavra-chave.",
  highlights: {
    kind: "Uma cifra clássica de substituição de pares de letras.",
    safety: "Não protege nada hoje: a análise de frequência dos pares descobre o texto.",
    key: "Uma palavra-chave formada só por letras, que define a grade.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "A Cifra de Playfair é uma cifra de substituição que trabalha com pares de letras, e não com letras isoladas. Ela foi inventada pelo cientista inglês Charles Wheatstone em 1854, o mesmo que trabalhou no telégrafo elétrico. O nome vem de Lord Playfair, amigo de Wheatstone, que divulgou o método junto ao governo britânico.",
        "Ao cifrar pares, a Playfair esconde melhor as frequências das letras do que a Cifra de César. Existem 26 letras, mas centenas de pares possíveis, e a contagem de pares exige textos bem maiores para dar resultado.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "Primeiro, monta-se uma grade 5x5 com 25 letras. Escreve-se a palavra-chave sem repetir letras e, depois, o resto do alfabeto. Como a grade tem 25 casas e o alfabeto tem 26 letras, o J é trocado por I.",
        "Depois, o texto é preparado: no playground, os acentos e os espaços são removidos, tudo vira maiúscula e o J vira I. O texto é dividido em pares. Se um par tem duas letras iguais, um X é inserido entre elas. Se sobra uma letra no fim, um X completa o último par.",
        "Cada par é cifrado com três regras. Se as duas letras estão na mesma linha, cada uma vira a letra à sua direita. Se estão na mesma coluna, cada uma vira a letra de baixo. Se estão em linhas e colunas diferentes, elas formam os cantos de um retângulo, e cada letra vira o outro canto da sua própria linha. Para decifrar, as regras são feitas ao contrário.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "O exemplo clássico usa a palavra-chave PLAYFAIREXAMPLE. A grade fica, linha por linha: PLAYF, IREXM, BCDGH, KNOQS e TUVWZ. O texto é \"Hide the gold in the tree stump\" (\"esconda o ouro no toco da árvore\", em inglês).",
        "Preparado, o texto vira os pares HI DE TH EG OL DI NT HE TR EX ES TU MP. Repare no X entre os dois E de tree. O par HI forma um retângulo: o H está na terceira linha e o I na segunda, então eles viram B e M. No fim, o resultado é BMODZBXDNABEKUDMUIXMMOUVIF.",
        "Faça o teste no playground desta página: escolha Cifra de Playfair, use a palavra-chave PLAYFAIREXAMPLE e digite o texto. Ao decifrar, o playground mostra HIDETHEGOLDINTHETREXESTUMP, o texto preparado, sem espaços e com o X inserido.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "A Playfair foi usada pelo exército britânico na Guerra dos Bôeres, no fim do século XIX, e na Primeira Guerra Mundial, como cifra de campo. Ela tinha uma vantagem importante: podia ser feita à mão, sem máquina, e protegia a mensagem por algumas horas, tempo suficiente para que uma ordem tática perdesse a utilidade.",
        "Na Segunda Guerra Mundial, ela ainda era usada por forças aliadas no Pacífico. Em 1943, depois que o barco PT-109, comandado pelo futuro presidente americano John F. Kennedy, afundou nas Ilhas Salomão, a mensagem que levou ao resgate da tripulação foi cifrada com a Playfair. Hoje, a cifra aparece em aulas, livros e competições de criptografia.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é feita à mão com papel e lápis, não depende de máquina e resiste à análise de frequência simples, que quebra a Cifra de César.",
        "Pontos fracos: a análise de frequência dos pares funciona com textos longos. Em cada idioma, alguns pares de letras são muito mais comuns que outros. A cifra também deixa pistas: um par cifrado nunca tem duas letras iguais, e se AB vira XY, então BA vira YX. Em 1914, o oficial americano Joseph Mauborgne publicou um método para quebrá-la. Hoje, um computador descobre a grade em segundos.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use a Cifra de Playfair para aprender como uma cifra de pares de letras funciona, para resolver enigmas ou para entender por que cifrar blocos maiores dificulta a análise de frequência.",
        "Nunca use a Playfair para proteger um dado real. Para enviar um segredo, use criptografia moderna, como o AES-256-GCM, que também cifra blocos, mas de 128 bits e com uma chave aleatória.",
      ],
    },
  ],
  related: ["vigenere", "enigma"],
  publishedAt: "2026-10-31",
};
