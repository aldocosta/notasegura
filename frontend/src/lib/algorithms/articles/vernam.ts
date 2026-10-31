import type { Article } from "../types";

export const vernam: Article = {
  id: "vernam",
  description:
    "Como funciona a Cifra de Vernam, o one-time pad com XOR, por que Shannon provou o sigilo perfeito e por que reusar a chave é fatal.",
  lead: "Uma chave aleatória do tamanho do texto, usada uma única vez. É a única cifra que se provou impossível de quebrar, e também uma das menos práticas.",
  highlights: {
    kind: "Uma cifra clássica de uso único, o one-time pad.",
    safety: "Segura só se a chave for aleatória, do tamanho do texto, secreta e usada uma única vez.",
    key: "Uma sequência aleatória de bytes do mesmo tamanho do texto.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "A Cifra de Vernam combina cada parte do texto com uma parte de uma chave aleatória. Ela foi criada em 1917 por Gilbert Vernam, engenheiro da AT&T, para proteger mensagens de teleimpressora, as máquinas que enviavam texto por fios telegráficos. As mensagens eram gravadas em fitas de papel perfuradas, e uma segunda fita trazia a chave.",
        "Quando a chave é aleatória, tem o mesmo tamanho do texto e é usada uma única vez, a cifra é chamada de one-time pad, ou cifra de uso único. A ideia de nunca repetir a chave é atribuída ao oficial americano Joseph Mauborgne, que trabalhou com o sistema de Vernam.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "A operação é o XOR, ou \"ou exclusivo\", feita bit a bit. O XOR de dois bits é 1 quando eles são diferentes e 0 quando são iguais. Para cifrar, cada byte do texto é combinado por XOR com o byte da chave na mesma posição. Para decifrar, basta fazer o XOR do texto cifrado com a mesma chave, porque aplicar o XOR duas vezes com o mesmo valor devolve o valor original.",
        "Em 1949, Claude Shannon provou que, se a chave for de fato aleatória, tão longa quanto o texto e usada uma única vez, a cifra tem sigilo perfeito: o texto cifrado não dá nenhuma informação sobre o texto original. Qualquer texto do mesmo tamanho é igualmente provável, e nem um computador infinitamente rápido consegue escolher o certo.",
        "No playground, o texto é transformado em bytes com UTF-8, e o navegador gera uma chave aleatória com o mesmo número de bytes. O resultado e a chave aparecem em Base64.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha Cifra de Vernam e digite \"olá\". O texto tem 4 bytes em UTF-8, então a chave também tem 4 bytes. A letra o é o byte 01101111. Se o byte da chave for 00111100, o XOR dá 01010011. A cada clique em \"Encriptar\", o navegador sorteia uma chave nova, e o resultado muda.",
        "Clique em \"Decifrar\": o playground faz o XOR do resultado com a mesma chave e devolve \"olá\". Sem a chave, o resultado poderia ser a cifra de qualquer outro texto de 4 bytes.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O one-time pad foi usado por diplomatas e espiões ao longo do século XX, com blocos de papel que traziam páginas de números aleatórios. Cada página era usada uma vez e depois destruída. A linha direta entre Moscou e Washington, criada em 1963, usava fitas de chave de uso único, trocadas pelas embaixadas.",
        "Reusar a chave é fatal. Durante a Segunda Guerra Mundial, os soviéticos produziram algumas páginas de chave em duplicidade. O projeto americano Venona aproveitou essa repetição e, por décadas, leu milhares de mensagens soviéticas, o que ajudou a identificar espiões, como Julius Rosenberg. Com duas mensagens cifradas com a mesma chave, o XOR entre elas elimina a chave e deixa só o XOR dos dois textos, que pode ser analisado.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: bem usada, é impossível de quebrar, mesmo com computadores quânticos. A operação é simples e rápida.",
        "Pontos fracos: a chave precisa ser do tamanho de cada mensagem, totalmente aleatória, entregue ao destinatário com segurança e destruída depois do uso. Se existe um canal seguro para entregar uma chave desse tamanho, quase sempre é mais fácil usá-lo para enviar a própria mensagem. A cifra também não detecta alterações: quem troca um bit do texto cifrado troca o mesmo bit do texto decifrado.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use a Cifra de Vernam do playground para entender o XOR, o sigilo perfeito e por que a chave nunca pode ser reusada. Em casos muito específicos, governos ainda usam cifras de uso único.",
        "Para o dia a dia, prefira criptografia moderna, como o AES-256-GCM: uma chave curta de 256 bits protege mensagens de qualquer tamanho e ainda detecta alterações.",
      ],
    },
  ],
  related: ["vigenere", "aes-gcm"],
};
