import type { Guide } from "../types";

export const sha256Sha1OuMd5: Guide = {
  slug: "sha-256-sha-1-ou-md5",
  kind: "Comparação",
  title: "SHA-256, SHA-1 ou MD5: qual hash usar?",
  description:
    "MD5, SHA-1 e SHA-256 comparados: tamanho, colisões conhecidas, o que cada um ainda faz bem e por que nenhum deles serve para guardar senhas.",
  lead: "O MD5 e o SHA-1 já foram quebrados; o SHA-256 é a escolha segura para uma impressão digital de dados.",
  highlights: [
    { title: "Use o SHA-256", text: "Nenhum ataque prático contra o SHA-256 é conhecido." },
    { title: "Evite MD5 e SHA-1", text: "Já existem arquivos diferentes com o mesmo hash nos dois." },
    { title: "Senhas são outro caso", text: "Para senhas, use uma função lenta, como o Argon2." },
  ],
  sections: [
    {
      title: "Resumo",
      paragraphs: [
        "MD5, SHA-1 e SHA-256 são funções de hash. Cada uma transforma um texto de qualquer tamanho em uma impressão digital de tamanho fixo. A mesma entrada sempre gera o mesmo hash, e não existe caminho de volta do hash para o texto.",
        "Um hash só é seguro se ninguém consegue criar uma colisão, ou seja, duas entradas diferentes com o mesmo hash. O MD5 e o SHA-1 falharam nesse teste, e hoje qualquer pessoa com um computador comum consegue fabricar colisões de MD5. O SHA-256 continua resistente. Para dados novos, use o SHA-256.",
      ],
    },
    {
      title: "Como cada um funciona",
      paragraphs: [
        "Os três seguem a mesma ideia: o texto é cortado em blocos, e cada bloco é misturado com um estado interno em várias rodadas de somas, rotações e operações lógicas. O estado final é o hash. A diferença está no tamanho do estado e na quantidade de rodadas.",
        "O MD5 foi criado por Ronald Rivest em 1991 e gera 128 bits, mostrados como 32 caracteres hexadecimais. O SHA-1 foi criado pela NSA, publicado pelo NIST em 1995 e gera 160 bits, ou 40 caracteres. O SHA-256 faz parte da família SHA-2, também da NSA e do NIST, e gera 256 bits, ou 64 caracteres. Da mesma família, o SHA-512 gera 512 bits e costuma ser mais rápido em processadores de 64 bits.",
        "Veja o hash do texto \"abc\" em cada um. No MD5: 900150983cd24fb0d6963f7d28e17f72. No SHA-1: a9993e364706816aba3e25717850c26c9cd0d89d. No SHA-256: ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad. Troque uma única letra e os três resultados mudam por completo.",
      ],
    },
    {
      title: "Comparação lado a lado",
      paragraphs: [
        "A tabela mostra o tamanho de cada hash e o que se sabe sobre colisões. Um hash maior não basta: o que importa é não existir um atalho para achar colisões.",
      ],
      table: {
        caption: "MD5, SHA-1 e SHA-256 comparados",
        columns: ["Critério", "MD5", "SHA-1", "SHA-256"],
        rows: [
          ["Tamanho do hash", "128 bits", "160 bits", "256 bits"],
          ["Caracteres hexadecimais", "32", "40", "64"],
          ["Colisão prática conhecida", "Sim, desde 2004", "Sim, desde 2017 (SHAttered)", "Não"],
          [
            "Uso seguro hoje",
            "Só detectar erros acidentais de cópia",
            "Só detectar erros acidentais e sistemas antigos",
            "Integridade, assinaturas, HMAC e blockchain",
          ],
        ],
      },
    },
    {
      title: "Quando escolher cada um",
      paragraphs: [
        "O MD5 caiu primeiro. Em 2004, a equipe da pesquisadora chinesa Xiaoyun Wang publicou colisões de MD5. Em 2012, o malware Flame usou uma colisão de MD5 para forjar um certificado da Microsoft e se passar por uma atualização legítima do Windows. Depois disso, nenhum sistema sério confia no MD5 para provar que um arquivo é autêntico.",
        "O SHA-1 caiu em 2017. No ataque SHAttered, o Google e o CWI Amsterdam publicaram dois arquivos PDF diferentes com o mesmo SHA-1. Os navegadores deixaram de aceitar certificados com SHA-1 na mesma época, e o Git, que identifica cada versão de um projeto por um hash SHA-1, está migrando para o SHA-256.",
        "O MD5 e o SHA-1 ainda servem para detectar um erro acidental, como um arquivo corrompido em um download. Eles não servem para detectar uma alteração feita de propósito, porque um atacante consegue preparar dois arquivos com o mesmo hash. Para isso, use o SHA-256. Se a impressão digital também precisa provar quem a gerou, use um HMAC-SHA-256, que combina o hash com uma chave secreta.",
        "Senhas são um caso à parte. Os três hashes são rápidos de propósito, e um atacante com placas de vídeo testa bilhões de senhas por segundo. Para guardar senhas, nenhum dos três basta: use Argon2, scrypt, bcrypt ou PBKDF2, que são lentos de propósito e usam um sal.",
      ],
    },
    {
      title: "Conclusão",
      paragraphs: [
        "Para qualquer uso novo, escolha o SHA-256. Mantenha o MD5 e o SHA-1 apenas onde um sistema antigo exige e onde o objetivo é só detectar erros acidentais. Para provar que uma mensagem veio de quem tem a chave, use o HMAC-SHA-256. Para senhas, use uma função de derivação lenta, como o Argon2.",
        "Você pode calcular os três hashes no playground de cada algoritmo e conferir os resultados de \"abc\" desta página.",
      ],
    },
  ],
  algorithms: ["sha-256", "sha-1", "md5", "sha-512", "hmac-sha-256"],
  related: ["criptografia-hash-ou-codificacao", "como-guardar-senhas"],
  publishedAt: "2026-10-31",
};
