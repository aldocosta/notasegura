import type { Article } from "../types";

export const enigma: Article = {
  id: "enigma",
  description:
    "Como funcionava a Máquina Enigma, com rotores e refletor, e como Rejewski, Turing e Bletchley Park quebraram a cifra alemã.",
  lead: "A máquina de cifrar mais famosa da história: rotores que mudam a substituição a cada letra digitada. Os alemães a achavam inquebrável.",
  highlights: {
    kind: "Uma cifra clássica polialfabética, feita por uma máquina eletromecânica.",
    safety: "Não protege nada hoje: foi quebrada durante a Segunda Guerra Mundial.",
    key: "A escolha e a ordem dos rotores, a posição inicial e as conexões do painel.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "A Enigma é uma máquina de cifrar eletromecânica, parecida com uma máquina de escrever. O engenheiro alemão Arthur Scherbius patenteou a máquina em 1918 e começou a vendê-la para empresas. A partir dos anos 1920, as forças armadas alemãs adotaram versões próprias, que foram usadas em larga escala na Segunda Guerra Mundial.",
        "A Enigma é uma cifra polialfabética: a substituição muda a cada letra. Uma letra A pode virar B na primeira posição e D na segunda. Com a chave certa, a mesma máquina decifra a mensagem.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "Quando o operador aperta uma tecla, a corrente elétrica passa por três rotores. Cada rotor é um disco com 26 contatos de cada lado, ligados de forma embaralhada, e troca uma letra por outra. Depois dos rotores, a corrente chega ao refletor, que a manda de volta pelos mesmos rotores, por outro caminho. No fim, uma lâmpada acende com a letra cifrada.",
        "O segredo está no movimento. A cada tecla, o rotor da direita gira uma posição antes de cifrar a letra, e a substituição muda. Quando ele passa por um ponto de virada, o rotor do meio também gira, como em um hodômetro. O rotor do meio tem um detalhe, o passo duplo: quando chega ao seu ponto de virada, ele gira de novo na tecla seguinte, junto com o rotor da esquerda. No playground, as posições ADU, ADV, AEW, BFX e BFY mostram esse passo duplo.",
        "As versões militares tinham ainda um painel de conexões, que trocava pares de letras antes e depois dos rotores. O playground simula a Enigma I com os rotores I, II e III, o refletor B, os anéis em A e sem painel de conexões.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha Máquina Enigma, mantenha a posição inicial AAA e digite AAAAA. O resultado é BDZGO. As cinco letras iguais viram cinco letras diferentes, porque o rotor da direita gira antes de cada letra.",
        "Clique em \"Decifrar\": o playground passa BDZGO pela mesma máquina, a partir da mesma posição, e o resultado volta a ser AAAAA. Na Enigma, as mesmas configurações cifram e decifram. Como a máquina original só tinha letras maiúsculas, o texto decifrado aparece em maiúsculas, e os espaços e os sinais ficam como estão.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "A Enigma foi usada pelo exército, pela marinha e pela força aérea da Alemanha nazista para enviar ordens por rádio. Os alemães acreditavam que ela era inquebrável: a versão militar tinha cerca de 159 quintilhões de configurações possíveis.",
        "A primeira quebra veio da Polônia. A partir de 1932, o matemático Marian Rejewski, do serviço de cifras polonês, reconstruiu as ligações dos rotores usando matemática e documentos obtidos pelo serviço secreto francês. Com Jerzy Różycki e Henryk Zygalski, ele leu mensagens alemãs por anos. Em julho de 1939, semanas antes da invasão da Polônia, os poloneses entregaram esse trabalho aos britânicos e aos franceses.",
        "Na Inglaterra, em Bletchley Park, Alan Turing e Gordon Welchman projetaram as bombas, máquinas eletromecânicas que testavam configurações da Enigma em alta velocidade. As informações obtidas, chamadas de Ultra, ajudaram os Aliados, por exemplo na batalha contra os submarinos no Atlântico.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: para a época, o número de configurações era enorme, e a substituição mudava a cada letra, o que derrotava a análise de frequência simples.",
        "Pontos fracos: o refletor faz com que uma letra nunca vire ela mesma. Parece um detalhe, mas os criptoanalistas usaram essa falha para encaixar palavras que esperavam encontrar, como \"WETTER\" (tempo, em alemão) nos boletins do tempo, e descartar posições impossíveis. Erros dos operadores, como repetir a chave ou usar mensagens previsíveis, também ajudaram. Hoje, um computador comum quebra uma mensagem da Enigma sem dificuldade.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use a Máquina Enigma do playground para entender como os rotores mudam a substituição, para ver o passo duplo e para conhecer a história da criptografia na Segunda Guerra Mundial.",
        "Nunca use a Enigma para proteger um dado real. Para guardar um segredo, use criptografia moderna, como o AES-256-GCM, que é o algoritmo que este site usa para as notas.",
      ],
    },
  ],
  related: ["vigenere", "vernam"],
};
