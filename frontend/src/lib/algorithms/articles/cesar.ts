import type { Article } from "../types";

export const cesar: Article = {
  id: "cesar",
  description:
    "Como funciona a Cifra de César, usada por Júlio César, por que ela é quebrada em segundos e o que é o ROT13.",
  lead: "A cifra mais famosa da história: cada letra anda algumas posições no alfabeto. Ótima para aprender, inútil para proteger.",
  highlights: {
    kind: "Uma cifra clássica de substituição, feita à mão.",
    safety: "Não protege nada hoje: existem só 25 chaves possíveis.",
    key: "Um número de 1 a 25, o deslocamento das letras.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "A Cifra de César é uma cifra de substituição: cada letra do texto é trocada por outra letra, sempre a mesma quantidade de posições à frente no alfabeto. O nome vem de Júlio César. O historiador romano Suetônio conta que César usava esse método em cartas pessoais, com um deslocamento de 3 posições.",
        "Por séculos, a cifra funcionou porque poucas pessoas sabiam ler, e menos ainda conheciam o método. Hoje ela serve para ensinar as ideias básicas da criptografia: o algoritmo, a chave e o ataque.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "A chave é um número, o deslocamento. Com deslocamento 3, o A vira D, o B vira E, e assim por diante. Ao chegar ao fim do alfabeto, a contagem volta ao começo: o X vira A, o Y vira B e o Z vira C.",
        "Para decifrar, basta andar o mesmo número de posições para trás. No playground, letras maiúsculas e minúsculas mantêm o formato, e os números, os sinais e as letras com acento ficam como estão.",
        "Como o alfabeto tem 26 letras, existem só 25 deslocamentos úteis. O deslocamento 26 devolve o próprio texto.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha Cifra de César, mantenha o deslocamento 3 e digite \"Abc, xyz!\". O resultado é Def, abc!. A vírgula, o espaço e o ponto de exclamação não mudam, e o x, o y e o z dão a volta no alfabeto.",
        "Para quebrar a cifra sem saber a chave, basta testar os 25 deslocamentos e procurar aquele que gera um texto que faz sentido. Uma pessoa com papel e lápis faz isso em poucos minutos. Um computador faz em menos de um milissegundo.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "A Cifra de César não é usada para proteger nada sério. Ela aparece em aulas, em livros sobre criptografia, em jogos de enigmas e em brinquedos de decodificar mensagens.",
        "Uma variante ficou famosa na internet: o ROT13, que usa deslocamento 13. Como 13 é metade de 26, aplicar o ROT13 duas vezes devolve o texto original. Em fóruns antigos, ele era usado para esconder spoilers e respostas de charadas, não para proteger segredos, e sim para que ninguém lesse sem querer.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é simples de entender e de fazer à mão, e mostra bem a diferença entre o algoritmo, que todos conhecem, e a chave, que deveria ser secreta.",
        "Pontos fracos: são só 25 chaves, então testar todas é imediato. Mesmo sem testar as chaves, a cifra cai com a análise de frequência, descrita pelo estudioso árabe Al-Kindi no século IX. Em português, as letras mais comuns são A, E e O. Se a letra mais comum do texto cifrado é H, o deslocamento provavelmente é 7, porque o H fica 7 posições depois do A. A cifra também mantém a estrutura do texto: os espaços, o tamanho das palavras e as letras repetidas ficam visíveis.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use a Cifra de César para aprender, para ensinar ou para brincar, por exemplo em uma caça ao tesouro.",
        "Nunca use a Cifra de César para proteger uma senha, uma mensagem pessoal ou qualquer dado real. Para isso, use criptografia moderna, como o AES-256-GCM, que é o algoritmo que este site usa para as notas.",
      ],
    },
  ],
  related: ["vigenere", "base64"],
};
