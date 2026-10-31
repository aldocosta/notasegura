import type { Article } from "../types";

export const rot13: Article = {
  id: "rot13",
  description:
    "O que é o ROT13, a Cifra de César com deslocamento 13, por que aplicá-lo duas vezes devolve o texto e como era usado na Usenet.",
  lead: "Uma Cifra de César com deslocamento fixo de 13 posições. Serve para esconder um texto de olhares distraídos, não para proteger segredos.",
  highlights: {
    kind: "Uma cifra clássica de substituição, a Cifra de César com deslocamento 13.",
    safety: "Não protege nada: só existe uma forma de cifrar, e todo mundo a conhece.",
    key: "Não tem chave. O deslocamento é sempre 13.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "ROT13 quer dizer \"rodar 13 posições\". É a Cifra de César com um deslocamento fixo de 13: cada letra do texto é trocada pela letra que fica 13 posições à frente no alfabeto. O A vira N, o B vira O, e assim por diante.",
        "Como o deslocamento é sempre o mesmo, o ROT13 não tem chave. Quem conhece o nome do método já sabe como desfazê-lo. Por isso ele não é usado para guardar segredos, e sim para evitar que alguém leia um texto sem querer, como o final de um filme ou a resposta de uma charada.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "O alfabeto latino tem 26 letras, e 13 é exatamente a metade de 26. Por isso, andar 13 posições duas vezes é o mesmo que andar 26 posições, ou seja, dar uma volta completa no alfabeto e voltar à letra original. Aplicar o ROT13 duas vezes devolve o texto original.",
        "Essa propriedade faz com que a mesma operação sirva para cifrar e para decifrar. Não é preciso uma função de volta: basta aplicar o ROT13 de novo. No playground, letras maiúsculas e minúsculas mantêm o formato, e os números, os sinais e as letras com acento ficam como estão.",
        "As letras de A a M viram as letras de N a Z, e as letras de N a Z viram as de A a M. É como dividir o alfabeto em duas metades e trocar uma pela outra.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha ROT13 e digite \"Hello, World!\". O resultado é Uryyb, Jbeyq!. A palavra Hello vira Uryyb: o H anda 13 posições e vira U, o e vira r, cada l vira y e o o vira b. A vírgula, o espaço e o ponto de exclamação não mudam.",
        "Agora clique em \"Decifrar\". O playground aplica o ROT13 mais uma vez ao resultado, e o texto volta a ser \"Hello, World!\". Repare que as duas letras l iguais viram duas letras y iguais: o ROT13, como toda cifra de substituição simples, mantém as letras repetidas e o tamanho das palavras à vista.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O ROT13 ficou famoso na Usenet, a rede de grupos de discussão que antecedeu os fóruns da web. Nos anos 1980, os participantes usavam o ROT13 para esconder spoilers, respostas de charadas e piadas que alguns leitores poderiam achar ofensivas. Quem quisesse ler aplicava o ROT13, e muitos programas de leitura tinham um botão para isso.",
        "Ele ainda aparece em outros lugares:",
      ],
      items: [
        "Em fóruns e sites de enigmas, para esconder a resposta até que o leitor decida vê-la.",
        "No registro do Windows, onde algumas entradas sobre programas usados recentemente são gravadas em ROT13.",
        "Em aulas de programação, como um primeiro exercício de manipulação de texto.",
        "Em piadas sobre segurança: \"cifrar duas vezes com ROT13\" é a forma clássica de zombar de uma proteção falsa.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é simples, rápido e reversível com a mesma operação. Para esconder um spoiler, isso basta: o leitor não entende o texto de relance, mas pode lê-lo quando quiser.",
        "Pontos fracos: não existe nenhum segredo. Como não há chave, qualquer pessoa desfaz o ROT13 em um instante, até de cabeça depois de alguma prática. E, como na Cifra de César, cada letra sempre vira a mesma letra, então a análise de frequência e o formato das palavras entregam o texto. O ROT13 não protege números nem acentos, que ficam iguais.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o ROT13 para esconder um spoiler, a resposta de um jogo ou o final de uma história, quando o objetivo é só evitar a leitura acidental.",
        "Nunca use o ROT13 para proteger uma senha, uma mensagem pessoal ou qualquer dado real. Um texto em ROT13 parece embaralhado, mas não tem proteção nenhuma. Para guardar um segredo, use criptografia moderna, como o AES-256-GCM, que é o algoritmo que este site usa para as notas.",
      ],
    },
  ],
  related: ["cesar", "atbash"],
  publishedAt: "2026-10-31",
};
