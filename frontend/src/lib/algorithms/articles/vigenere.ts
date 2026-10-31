import type { Article } from "../types";

export const vigenere: Article = {
  id: "vigenere",
  description:
    "Como funciona a Cifra de Vigenère, por que foi chamada de indecifrável por séculos, como Kasiski a quebrou e o que é o one-time pad.",
  lead: "Uma palavra-chave dá um deslocamento diferente a cada letra. Resistiu por três séculos, mas hoje cai em segundos.",
  highlights: {
    kind: "Uma cifra clássica com vários deslocamentos.",
    safety: "Não protege nada hoje: a análise estatística descobre a chave.",
    key: "Uma palavra-chave formada só por letras.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "A Cifra de Vigenère é uma cifra polialfabética: em vez de um único deslocamento para todo o texto, como na Cifra de César, cada letra recebe um deslocamento diferente, definido por uma palavra-chave.",
        "O método foi descrito pelo italiano Giovan Battista Bellaso em 1553. Mais tarde, foi atribuído por engano ao diplomata francês Blaise de Vigenère, que publicou uma cifra parecida, e ficou com o nome dele. Durante cerca de três séculos, a cifra teve a fama de ser indecifrável.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "Cada letra da palavra-chave vale um deslocamento: A vale 0, B vale 1, C vale 2, até Z, que vale 25. A palavra-chave é repetida ao longo do texto, e cada letra do texto anda o número de posições da letra da chave que está embaixo dela.",
        "Assim, a mesma letra do texto pode virar letras diferentes no resultado, dependendo da posição. Isso esconde as frequências que entregam a Cifra de César. No playground, a chave só avança nas letras: espaços, números, sinais e letras com acento ficam como estão e não consomem a chave.",
        "Para decifrar, quem conhece a palavra-chave faz o caminho inverso, voltando cada letra o número de posições da letra da chave.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "O exemplo clássico usa a palavra-chave LEMON e o texto ATTACKATDAWN (\"ataque ao amanhecer\", em inglês). A primeira letra, A, anda 11 posições, o valor de L, e vira L. A segunda, T, anda 4 posições, o valor de E, e vira X. No fim, o resultado é LXFOPVEFRNHR.",
        "Repare que o texto tem quatro letras A, e elas viram L, O, E e N, conforme a posição. Faça o teste no playground desta página: escolha Cifra de Vigenère, use a palavra-chave LEMON e digite ATTACKATDAWN.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "A cifra foi usada em correspondência diplomática e militar entre os séculos XVI e XIX, inclusive pelos Confederados na Guerra Civil dos Estados Unidos. Hoje, ela aparece em aulas de criptografia, em livros, em desafios de programação e em jogos de enigmas.",
        "A ideia por trás dela continua importante. Se a chave for aleatória, tão longa quanto o texto e usada uma única vez, a cifra se torna o one-time pad, ou cifra de uso único. Esse método, ligado ao trabalho de Gilbert Vernam em 1917, foi provado inquebrável por Claude Shannon em 1949. O problema é prático: entregar com segurança uma chave do tamanho de cada mensagem.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: resiste à análise de frequência simples, que quebra a Cifra de César, e pode ser feita à mão com uma tabela de alfabetos.",
        "Pontos fracos: a chave se repete. Charles Babbage, por volta de 1854, e Friedrich Kasiski, que publicou o método em 1863, perceberam que trechos repetidos no texto cifrado revelam o tamanho da chave. Com o tamanho da chave, o texto é separado em colunas, e cada coluna é uma Cifra de César comum, que cai com a análise de frequência. No século XX, William Friedman criou o índice de coincidência, uma medida estatística que também encontra o tamanho da chave. Hoje, um computador quebra a cifra em segundos.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use a Cifra de Vigenère para aprender por que o tamanho e a aleatoriedade da chave importam, ou para criar enigmas.",
        "Nunca use a Cifra de Vigenère para proteger um dado real. Para enviar um segredo, use criptografia moderna, como o AES-256-GCM, com uma chave aleatória gerada pelo computador.",
      ],
    },
  ],
  related: ["cesar", "aes-gcm"],
  publishedAt: "2026-10-30",
};
