import type { Article } from "../types";

export const sha256: Article = {
  id: "sha-256",
  description:
    "O que é o SHA-256, por que um hash não é criptografia, onde ele é usado e por que não serve para guardar senhas sozinho.",
  lead: "Uma impressão digital de tamanho fixo para qualquer texto: fácil de calcular e impossível de desfazer.",
  highlights: {
    kind: "Gera uma impressão digital do texto, sem chave.",
    safety: "Não esconde o texto: só confirma se ele é igual ao original.",
    key: "Não usa chave. Qualquer pessoa calcula o mesmo hash.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "O SHA-256 é uma função de hash da família SHA-2, criada pela NSA e padronizada pelo NIST. A versão atual do padrão é o FIPS 180-4. Uma função de hash transforma qualquer entrada, de uma letra a um arquivo de vários gigabytes, em uma sequência de tamanho fixo.",
        "No SHA-256, essa sequência tem sempre 256 bits, que aparecem como 64 caracteres hexadecimais. Esse resultado funciona como uma impressão digital: ele identifica o conteúdo, mas não contém o conteúdo.",
        "Um hash não é criptografia. Não existe chave e não existe caminho de volta. O objetivo não é esconder o texto, e sim provar que ele não mudou.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "O texto é dividido em blocos de 512 bits. Cada bloco passa por 64 rodadas de operações simples, como somas, rotações de bits e combinações lógicas, que misturam o bloco com um estado interno. No fim, o estado interno é o hash.",
        "Uma boa função de hash tem três propriedades. A primeira: o mesmo texto sempre gera o mesmo hash. A segunda: uma mudança mínima, como trocar uma letra, muda o hash inteiro, o que se chama efeito avalanche. A terceira: é inviável achar um texto a partir do hash, ou achar dois textos diferentes com o mesmo hash.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha SHA-256 e digite \"abc\". O resultado é sempre ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad, em qualquer computador do mundo. Troque para \"abd\" e o hash muda por completo, sem nenhuma semelhança com o anterior.",
        "Repare que o playground não mostra o botão \"Decifrar\". Não é uma limitação do site: um hash não pode ser desfeito, porque infinitos textos diferentes cabem no mesmo tamanho fixo de 256 bits.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O SHA-256 está em muitos lugares que exigem integridade:",
      ],
      items: [
        "Downloads: sites publicam o hash do arquivo, e você confere se o arquivo baixado tem o mesmo hash.",
        "Assinaturas digitais e certificados: assina-se o hash do documento, e não o documento inteiro.",
        "HMAC: um hash combinado com uma chave secreta, que prova quem enviou uma mensagem e que ela não mudou.",
        "Bitcoin: a mineração e os endereços usam o SHA-256.",
        "Criptografia: o RSA-OAEP e muitas funções de derivação de chave usam o SHA-256 internamente.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é rápido, padronizado e não tem nenhum ataque prático conhecido. Ninguém conseguiu achar duas entradas com o mesmo SHA-256.",
        "Pontos fracos: ser rápido é um problema para senhas. Se um banco de dados guarda o SHA-256 de cada senha, um atacante que copia o banco consegue testar bilhões de palpites por segundo e descobrir as senhas fracas. Senhas iguais também geram hashes iguais. Outro cuidado: calcular o SHA-256 de uma chave seguida de uma mensagem não autentica a mensagem com segurança, por causa de um ataque de extensão de tamanho. Para isso existe o HMAC.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o SHA-256 para conferir se um arquivo ou um texto não mudou, para gerar identificadores a partir de conteúdo e dentro de assinaturas e do HMAC.",
        "Não use o SHA-256 para proteger um segredo, porque ele não pode ser desfeito nem por quem tem direito de ler. Para guardar senhas, use uma função lenta e com sal, como Argon2, scrypt ou bcrypt. Para enviar um segredo a alguém, use criptografia, como o AES-256-GCM.",
      ],
    },
  ],
  related: ["base64", "aes-gcm"],
  publishedAt: "2026-10-30",
};
