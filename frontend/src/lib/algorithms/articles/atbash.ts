import type { Article } from "../types";

export const atbash: Article = {
  id: "atbash",
  description:
    "Como funciona a Cifra Atbash, que espelha o alfabeto, de onde ela vem no alfabeto hebraico e por que é quebrada na hora.",
  lead: "A primeira letra vira a última, a segunda vira a penúltima. Uma das cifras mais antigas que se conhecem, e uma das mais fáceis de quebrar.",
  highlights: {
    kind: "Uma cifra clássica de substituição monoalfabética.",
    safety: "Não protege nada: não tem chave, e conhecer o método basta para ler.",
    key: "Não tem chave. A troca de letras é sempre a mesma.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "A Cifra Atbash é uma cifra de substituição: cada letra do texto é trocada por outra, sempre pela mesma regra. A regra é espelhar o alfabeto. A primeira letra vira a última, a segunda vira a penúltima, e assim por diante. No alfabeto latino, o A vira Z, o B vira Y e o M vira N.",
        "Ela vem do alfabeto hebraico. O nome é formado pelas letras que trocam de lugar: aleph, a primeira letra, troca com tav, a última; bet, a segunda, troca com shin, a penúltima. Juntando aleph, tav, bet e shin, temos Atbash.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "A Atbash é uma substituição monoalfabética: existe um único alfabeto de troca, e cada letra sempre vira a mesma letra no resultado. Ela é uma cifra sem chave. Não há deslocamento para escolher nem palavra secreta: a tabela de troca é fixa e pública.",
        "Como a troca é um espelho, cifrar duas vezes devolve o texto original. O A vira Z, e o Z volta a ser A. Assim, a mesma operação serve para cifrar e para decifrar, como acontece com o ROT13.",
        "No playground, a troca vale para as letras de A a Z, maiúsculas e minúsculas, que mantêm o formato. Os números, os sinais e as letras com acento ficam como estão.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha Cifra Atbash e digite \"Abc, xyz!\". O resultado é Zyx, cba!. O A, a primeira letra, vira Z; o b vira y; o c vira x. Do outro lado do alfabeto, o x vira c, o y vira b e o z vira a. A vírgula, o espaço e o ponto de exclamação não mudam.",
        "Clique em \"Decifrar\" e o texto volta a ser \"Abc, xyz!\". O playground só aplica a Atbash de novo ao resultado.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O uso mais famoso da Atbash está na Bíblia hebraica, no Livro de Jeremias. Nos versículos 25:26 e 51:41, a palavra Sheshach aparece no lugar de Babel, o nome hebraico da Babilônia: as letras de Babel, trocadas pela Atbash, formam Sheshach. Em Jeremias 51:1, a expressão Leb Kamai aparece no lugar de Kasdim, os caldeus. Os estudiosos discutem se o objetivo era esconder o nome ou criar um efeito literário.",
        "Hoje, a Atbash aparece em aulas de criptografia, em livros de enigmas, em jogos e em desafios de programação. Ela também é um bom exemplo de que um método pode ser muito antigo e famoso sem ser seguro.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é simples de fazer à mão, basta escrever o alfabeto e, embaixo dele, o alfabeto ao contrário. E a mesma operação cifra e decifra.",
        "Pontos fracos: a Atbash não tem chave, então quem conhece o método já sabe ler a mensagem. Mesmo quem não conhece o método quebra a cifra com a análise de frequência, porque cada letra sempre vira a mesma letra. Em português, as letras mais comuns são A, E e O, que na Atbash viram Z, V e L. Se essas letras aparecem muito no texto cifrado, a Atbash é uma boa aposta. A cifra também mantém os espaços, o tamanho das palavras e as letras repetidas.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use a Cifra Atbash para aprender o que é uma substituição monoalfabética, para ensinar a análise de frequência ou para criar enigmas e jogos.",
        "Nunca use a Atbash para proteger uma senha, uma mensagem pessoal ou qualquer dado real. Para guardar um segredo, use criptografia moderna, como o AES-256-GCM, com uma chave aleatória gerada pelo computador.",
      ],
    },
  ],
  related: ["cesar", "rot13"],
  publishedAt: "2026-10-31",
};
