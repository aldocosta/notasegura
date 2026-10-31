import type { Article } from "../types";

export const md5: Article = {
  id: "md5",
  description:
    "O que é o MD5, como colisões o quebraram em 2004, o caso do malware Flame e por que ele só serve para detectar erros de cópia.",
  lead: "O hash mais famoso dos anos 1990, hoje quebrado: criar dois arquivos com o mesmo MD5 leva segundos.",
  highlights: {
    kind: "Gera uma impressão digital do texto, sem chave.",
    safety: "Quebrado: colisões são fáceis de criar.",
    key: "Não usa chave. Qualquer pessoa calcula o mesmo hash.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "O MD5 (Message Digest 5) é uma função de hash criada por Ronald Rivest, o R do RSA, em 1991, e publicada como RFC 1321 em 1992. Ele transforma qualquer entrada em um resultado de 128 bits, mostrado como 32 caracteres hexadecimais.",
        "Por muitos anos, foi o hash padrão para verificar downloads, guardar senhas e assinar certificados. Hoje ele é considerado quebrado para qualquer uso de segurança.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "O texto recebe um preenchimento e o seu tamanho, e é dividido em blocos de 512 bits. Cada bloco passa por 64 passos, organizados em quatro rodadas, que misturam quatro palavras de 32 bits com funções lógicas, somas, rotações e uma tabela de 64 constantes.",
        "O resultado final é a junção das quatro palavras depois do último bloco. Uma mudança de um único bit no texto altera, em média, metade dos bits do resultado, o chamado efeito avalanche. Essa propriedade continua valendo no MD5. O que falhou foi outra: a dificuldade de encontrar dois textos com o mesmo resultado.",
        "O playground desta página tem uma implementação própria do MD5, porque o navegador não oferece esse algoritmo. Ela foi conferida com os exemplos oficiais do RFC 1321.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground, escolha MD5 e digite \"abc\". O resultado é 900150983cd24fb0d6963f7d28e17f72. Um texto vazio gera d41d8cd98f00b204e9800998ecf8427e, um valor tão conhecido que aparece em muitos registros de sistemas.",
        "Para um texto comum, o MD5 ainda funciona como impressão digital. O problema é que qualquer pessoa consegue fabricar, em segundos, dois arquivos diferentes com o mesmo MD5.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "Em 2004, a pesquisadora Xiaoyun Wang e sua equipe mostraram a primeira colisão prática do MD5. Em 2008, pesquisadores usaram colisões e um conjunto de consoles para criar um certificado falso de autoridade certificadora, aceito pelos navegadores da época.",
        "Em 2012, o malware de espionagem Flame usou uma colisão de MD5 para falsificar uma assinatura da Microsoft e se espalhar como se fosse uma atualização do Windows. Hoje o MD5 só aparece em usos sem adversário, como detectar se um arquivo foi corrompido durante uma cópia, e em sistemas antigos.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é muito rápido e existe em todas as linguagens. Para detectar erros acidentais, como um download interrompido, ele ainda funciona.",
        "Pontos fracos: colisões são triviais, então ele não serve para assinaturas, certificados nem para provar que um arquivo não foi trocado por alguém. Para senhas, é ainda pior: é rapidíssimo, e existem tabelas enormes com o MD5 de bilhões de senhas comuns.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o MD5 apenas para detectar erros acidentais, quando não existe ninguém tentando enganar o sistema, ou quando um sistema antigo exige.",
        "Para segurança, use o SHA-256 ou o SHA-512. Para senhas, use Argon2, scrypt ou bcrypt. Se encontrar senhas guardadas com MD5, trate isso como um problema urgente.",
      ],
    },
  ],
  related: ["sha-1", "sha-256"],
};
