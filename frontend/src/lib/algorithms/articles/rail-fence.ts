import type { Article } from "../types";

export const railFence: Article = {
  id: "rail-fence",
  description:
    "Como funciona a Cerca de trilho, uma cifra de transposição que escreve o texto em zigue-zague, e por que ela é fácil de quebrar.",
  lead: "Nenhuma letra é trocada: as letras só mudam de lugar. O texto é escrito em zigue-zague e lido trilho por trilho.",
  highlights: {
    kind: "Uma cifra clássica de transposição.",
    safety: "Não protege nada: basta testar poucos números de trilhos.",
    key: "O número de trilhos, de 2 a 10 no playground.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "A Cerca de trilho é uma cifra de transposição. Ao contrário das cifras de substituição, como a Cifra de César, ela não troca nenhuma letra por outra. Ela só muda as letras de lugar, seguindo uma regra.",
        "O nome vem do desenho que o texto forma: as letras são escritas em zigue-zague, descendo e subindo por algumas linhas, como os trilhos de uma cerca. Depois, o texto cifrado é lido linha por linha. A chave é o número de trilhos.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "Escolhido o número de trilhos, a primeira letra vai para o trilho de cima, a segunda para o de baixo dele, e assim por diante até o último trilho. Ao chegar ao último, o caminho volta a subir, uma letra por trilho, até o primeiro. Esse vaivém continua até o fim do texto.",
        "Para cifrar, lê-se o primeiro trilho inteiro, da esquerda para a direita, depois o segundo, e assim por diante. Para decifrar, quem conhece o número de trilhos refaz o desenho: calcula quantas letras cabem em cada trilho, distribui o texto cifrado pelos trilhos e lê o zigue-zague de novo.",
        "No playground, todos os caracteres participam, inclusive espaços, números, sinais e letras com acento. Por isso a volta devolve exatamente o texto original.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "O exemplo clássico usa 3 trilhos e o texto WEAREDISCOVEREDFLEEATONCE (\"fomos descobertos, fujam já\", em inglês). Em zigue-zague, o primeiro trilho recebe W, E, C, R, L, T e E. O segundo trilho recebe ERDSOEEFEAOC. O terceiro recebe AIVDEN.",
        "Lendo um trilho depois do outro, o resultado é WECRLTEERDSOEEFEAOCAIVDEN. Faça o teste no playground desta página: escolha Cerca de trilho, mantenha 3 trilhos e digite o texto. Depois, clique em \"Decifrar\" para ver o texto voltar ao lugar.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "A Cerca de trilho é usada hoje em aulas, livros, jogos de enigmas e desafios de programação, como o exemplo mais simples de transposição.",
        "A ideia de mudar as letras de lugar, porém, é antiga e importante. Na Grécia antiga, os espartanos usavam a cítala, um bastão em que se enrolava uma tira de couro: o texto, escrito ao longo do bastão, ficava embaralhado na tira. Na Primeira Guerra Mundial, a cifra alemã ADFGVX combinava substituição e transposição. A criptografia moderna também mistura as duas ideias: algoritmos como o AES fazem várias rodadas de troca e de mistura de bytes.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é muito simples de fazer à mão e mostra bem a diferença entre substituir e transpor.",
        "Pontos fracos: o número de chaves é pequeno. Com um texto curto, só alguns números de trilhos fazem sentido, e testar todos leva segundos. A cifra também se entrega pela frequência das letras: como nenhuma letra muda, a frequência de cada letra no texto cifrado é a mesma do idioma. Se o texto cifrado tem muitos A, E e O, como o português, é sinal de que se trata de uma transposição, e não de uma substituição.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use a Cerca de trilho para aprender o que é uma cifra de transposição, para criar enigmas ou para praticar programação.",
        "Nunca use a Cerca de trilho para proteger um dado real. Para guardar um segredo, use criptografia moderna, como o AES-256-GCM, que é o algoritmo que este site usa para as notas.",
      ],
    },
  ],
  related: ["playfair", "cesar"],
};
