import type { Guide } from "../types";

export const criptografiaHashOuCodificacao: Guide = {
  slug: "criptografia-hash-ou-codificacao",
  kind: "Comparação",
  title: "Criptografia, hash ou codificação: qual é a diferença?",
  description:
    "Criptografia, hash e codificação transformam um texto de jeitos diferentes. Veja qual usa chave, qual tem volta e qual protege um segredo.",
  lead: "As três embaralham um texto, mas só a criptografia esconde o conteúdo de quem não tem a chave.",
  highlights: [
    { title: "Criptografia", text: "Esconde o texto. Só quem tem a chave certa consegue ler." },
    { title: "Hash", text: "Gera uma impressão digital de tamanho fixo, sem caminho de volta." },
    { title: "Codificação", text: "Só muda o formato. Qualquer pessoa desfaz, sem chave nenhuma." },
  ],
  sections: [
    {
      title: "Resumo",
      paragraphs: [
        "Muita coisa parece protegida só porque ficou ilegível. Um texto em Base64, um hash e um texto cifrado podem ter a mesma cara de sopa de letras, mas fazem coisas muito diferentes. Confundir os três é uma das causas mais comuns de vazamento de dados.",
        "A regra curta é esta: a criptografia usa uma chave e tem caminho de volta para quem tem a chave. O hash não tem chave nem caminho de volta. A codificação não tem chave, e qualquer pessoa faz o caminho de volta. Só a criptografia protege um segredo que precisa ser lido depois.",
      ],
    },
    {
      title: "Como cada um funciona",
      paragraphs: [
        "A criptografia transforma o texto com uma chave. Sem a chave, o resultado parece um monte de bytes aleatórios. Com a chave certa, o texto original volta. O AES-256-GCM, por exemplo, usa uma chave de 256 bits e ainda detecta se alguém alterou o texto cifrado. É o algoritmo que protege cada nota do Nota Segura - BR.",
        "O hash é uma função de mão única. Ele recebe um texto de qualquer tamanho e devolve sempre um resultado do mesmo tamanho: o SHA-256 devolve 256 bits, ou 64 caracteres hexadecimais. A mesma entrada gera sempre o mesmo hash, e uma letra diferente muda o resultado inteiro. Não existe chave nem operação inversa. Para descobrir a entrada, só testando palpites.",
        "A codificação muda apenas o formato dos dados, para que eles passem por um lugar que só aceita certos caracteres. O Base64 transforma bytes em letras, números e alguns símbolos: a palavra \"olá\" vira b2zDoQ==. O hexadecimal mostra cada byte com dois caracteres de 0 a 9 e de a até f: \"olá\" vira 6f6cc3a1. A regra é pública, e qualquer pessoa desfaz a codificação em segundos.",
        "Existe ainda um caso que mistura as ideias. O HMAC é um hash calculado junto com uma chave secreta. Ele não esconde a mensagem, mas prova que ela veio de quem tem a chave e que não foi alterada no caminho. É assim que muitos serviços assinam webhooks e tokens.",
      ],
    },
    {
      title: "Comparação lado a lado",
      paragraphs: [
        "A tabela resume o que cada transformação faz. A pergunta mais importante é a da quarta linha: ela protege um segredo?",
      ],
      table: {
        caption: "Criptografia, hash e codificação comparados",
        columns: ["Critério", "Criptografia", "Hash", "Codificação"],
        rows: [
          ["Usa uma chave", "Sim", "Não (o HMAC usa)", "Não"],
          ["Tem caminho de volta", "Sim, com a chave certa", "Não", "Sim, para qualquer pessoa"],
          [
            "Tamanho do resultado",
            "Parecido com o do texto, mais alguns bytes",
            "Fixo, qualquer que seja a entrada",
            "Maior que o texto: um terço a mais no Base64, o dobro no hexadecimal",
          ],
          ["Protege um segredo", "Sim", "Só confirma se o texto mudou", "Não"],
          ["Exemplo", "AES-256-GCM", "SHA-256", "Base64 e hexadecimal"],
        ],
      },
    },
    {
      title: "Quando escolher cada um",
      paragraphs: [
        "Use criptografia quando alguém precisa ler o conteúdo depois, mas só quem tem a chave. É o caso de mensagens, arquivos guardados na nuvem e notas como as do Nota Segura - BR. Use um hash quando você só precisa confirmar que um dado não mudou, como na verificação de um arquivo baixado. Use uma codificação quando o problema é o formato, como colocar uma imagem dentro de um e-mail ou um dado binário dentro de uma URL.",
        "Alguns erros aparecem com frequência em sistemas reais:",
      ],
      items: [
        "Senha em Base64: parece embaralhada, mas qualquer pessoa decodifica. Base64 não é proteção.",
        "\"Criptografar\" com MD5: o MD5 é um hash, não tem volta, e hoje é fraco até como hash.",
        "Senhas com criptografia reversível: se a chave vazar, todas as senhas vazam juntas. Senhas devem ser guardadas com uma função de hash lenta, com sal.",
        "Hash sem chave para autenticar mensagens: qualquer pessoa recalcula um SHA-256. Para provar a origem, use um HMAC.",
      ],
    },
    {
      title: "Conclusão",
      paragraphs: [
        "Antes de confiar em um texto embaralhado, pergunte se existe uma chave e quem a tem. Se não há chave, não há segredo: é uma codificação ou um hash. Para esconder um conteúdo, use criptografia moderna, como o AES-256-GCM. Para conferir se algo mudou, use o SHA-256, e para provar a origem, o HMAC-SHA-256.",
        "No playground, codifique \"olá\" em Base64 e em hexadecimal, calcule o SHA-256 e cifre o mesmo texto com o AES-256-GCM. Ver os quatro resultados lado a lado é o jeito mais rápido de entender a diferença.",
      ],
    },
  ],
  algorithms: ["aes-gcm", "sha-256", "base64", "hex", "hmac-sha-256"],
  related: ["sha-256-sha-1-ou-md5", "aes-gcm-ou-chacha20-poly1305"],
  publishedAt: "2026-10-31",
};
