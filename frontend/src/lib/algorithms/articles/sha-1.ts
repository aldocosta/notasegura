import type { Article } from "../types";

export const sha1: Article = {
  id: "sha-1",
  description:
    "O que é o SHA-1, como o ataque SHAttered de 2017 o quebrou, por que os navegadores o abandonaram e o que o Git fez.",
  lead: "Um hash que foi padrão da internet por vinte anos, até que pesquisadores criaram dois arquivos diferentes com o mesmo resultado.",
  highlights: {
    kind: "Gera uma impressão digital do texto, sem chave.",
    safety: "Quebrado: é possível criar dois arquivos com o mesmo SHA-1.",
    key: "Não usa chave. Qualquer pessoa calcula o mesmo hash.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "O SHA-1 é uma função de hash criada pela NSA e publicada pelo NIST em 1995. Ele transforma qualquer entrada em um resultado de 160 bits, mostrado como 40 caracteres hexadecimais.",
        "Durante muitos anos, ele foi usado em certificados HTTPS, assinaturas digitais, sistemas de controle de versão e verificação de arquivos. Hoje ele é considerado inseguro para qualquer uso que dependa de resistência a colisões.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "O texto é dividido em blocos de 512 bits, e cada bloco passa por 80 rodadas de operações sobre cinco palavras de 32 bits. A estrutura é parecida com a do MD5 e foi a base do SHA-2, mas com um estado interno menor.",
        "Uma colisão acontece quando dois textos diferentes geram o mesmo hash. Com 160 bits, encontrar uma colisão por tentativa e erro exigiria cerca de 2 elevado a 80 operações. Os ataques modernos encontram colisões com muito menos trabalho.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha SHA-1 e digite \"abc\". O resultado é a9993e364706816aba3e25717850c26c9cd0d89d, com 40 caracteres. Para um único texto, o SHA-1 ainda funciona como impressão digital: ninguém consegue achar um texto a partir desse resultado.",
        "O problema aparece quando alguém prepara dois arquivos de propósito. Foi o que mostrou o ataque SHAttered: dois PDFs com conteúdos diferentes e exatamente o mesmo SHA-1.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "Em 2005, pesquisadores chineses liderados por Xiaoyun Wang mostraram um ataque teórico. Em 2017, o Google e o instituto CWI Amsterdam publicaram o SHAttered, a primeira colisão prática, que exigiu cerca de nove quintilhões de cálculos de SHA-1. Em 2020, um novo ataque permitiu escolher o começo dos dois arquivos, o que torna falsificações de certificados viáveis.",
        "Os navegadores deixaram de aceitar certificados assinados com SHA-1 por volta de 2017. O Git, que identifica cada versão de um arquivo pelo SHA-1, passou a usar uma versão com detecção de colisões e já oferece um formato com SHA-256. O SHA-1 ainda aparece em sistemas antigos e no HMAC-SHA-1, em que a falha de colisão não se aplica da mesma forma.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é rápido, está em todas as bibliotecas e ainda não existe ataque prático para achar um texto a partir de um hash dado. Dentro do HMAC, em que a chave secreta muda o cálculo, as colisões conhecidas não permitem falsificar códigos.",
        "Pontos fracos: colisões são práticas. Um atacante pode criar um documento inofensivo e um malicioso com o mesmo SHA-1, obter uma assinatura para o primeiro e usá-la no segundo. Os 160 bits também deixam pouca margem para o futuro.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Não use o SHA-1 em sistemas novos. Para identificar arquivos, assinar ou verificar integridade, use o SHA-256 ou o SHA-512.",
        "Mantenha o SHA-1 apenas onde um sistema antigo exige, e planeje a migração. Se o seu sistema guarda senhas com SHA-1, troque por Argon2, scrypt ou bcrypt assim que possível.",
      ],
    },
  ],
  related: ["sha-256", "md5"],
  publishedAt: "2026-10-30",
};
