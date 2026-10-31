import type { Article } from "../types";

export const sha512: Article = {
  id: "sha-512",
  description:
    "O que é o SHA-512, como ele difere do SHA-256, onde aparece (Ed25519, senhas do Linux) e por que um hash não é criptografia.",
  lead: "O irmão maior do SHA-256: uma impressão digital de 512 bits, feita para processadores de 64 bits.",
  highlights: {
    kind: "Gera uma impressão digital do texto, sem chave.",
    safety: "Não esconde o texto: só confirma se ele é igual ao original.",
    key: "Não usa chave. Qualquer pessoa calcula o mesmo hash.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "O SHA-512 é uma função de hash da família SHA-2, a mesma do SHA-256, definida no padrão FIPS 180-4 do NIST. Ele transforma qualquer entrada em um resultado de 512 bits, mostrado como 128 caracteres hexadecimais.",
        "Como todo hash, ele não usa chave e não pode ser desfeito. O objetivo é identificar um conteúdo e provar que ele não mudou, e não esconder esse conteúdo.",
        "A família SHA-2 foi publicada no início dos anos 2000 para substituir o SHA-1. Ela inclui o SHA-224, o SHA-256, o SHA-384 e o SHA-512, que diferem no tamanho do resultado e das palavras internas. Mais de vinte anos depois, nenhuma delas tem ataque prático conhecido.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "A estrutura é a mesma do SHA-256, mas com números maiores. O texto é dividido em blocos de 1024 bits, e cada bloco passa por 80 rodadas de somas, rotações e combinações lógicas sobre palavras de 64 bits. No SHA-256, são blocos de 512 bits, 64 rodadas e palavras de 32 bits.",
        "Por trabalhar com palavras de 64 bits, o SHA-512 costuma ser mais rápido que o SHA-256 em processadores de 64 bits que não têm instruções especiais para o SHA-256. O padrão também define versões cortadas, como o SHA-512/256, que usam a mesma máquina e entregam um resultado menor.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha SHA-512 e digite \"abc\". O resultado é sempre ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f. São 128 caracteres, o dobro do SHA-256.",
        "Mude uma letra e o resultado muda por completo. Não existe botão para desfazer, porque um hash não tem caminho de volta.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O SHA-512 está em vários lugares do dia a dia:",
      ],
      items: [
        "Assinaturas Ed25519, que usam o SHA-512 internamente para gerar o número secreto de cada assinatura.",
        "Senhas do Linux: no arquivo de senhas, os registros que começam com $6$ usam o método sha512crypt, que repete o SHA-512 milhares de vezes com um sal.",
        "Verificação de arquivos baixados e de pacotes de software.",
        "HMAC-SHA-512 e funções de derivação de chave.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: não há ataque prático conhecido, e o resultado de 512 bits dá uma margem enorme contra colisões. É rápido em computadores de 64 bits.",
        "Pontos fracos: o resultado é longo, o que ocupa mais espaço quando só é preciso identificar um arquivo. Em processadores de 32 bits e em alguns chips com aceleração própria para o SHA-256, ele é mais lento. E, como todo hash rápido, ele não serve sozinho para guardar senhas: um atacante consegue testar muitos palpites por segundo.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o SHA-512 quando um padrão o exige, como no Ed25519, ou quando quiser uma margem maior que a do SHA-256 em sistemas de 64 bits. Para a maioria dos usos, o SHA-256 e o SHA-512 são igualmente seguros.",
        "Não use o SHA-512 puro para guardar senhas: use Argon2, scrypt ou bcrypt. Para autenticar uma mensagem com uma chave, use o HMAC.",
      ],
    },
  ],
  related: ["sha-256", "hmac-sha-256"],
  publishedAt: "2026-10-30",
};
