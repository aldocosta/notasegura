import type { Guide } from "../types";

export const oQueEUmaNotaAutodestrutiva: Guide = {
  slug: "o-que-e-uma-nota-autodestrutiva",
  kind: "Guia prático",
  title: "O que é uma nota autodestrutiva e quando usar",
  description:
    "Como funciona uma nota autodestrutiva: prazo, limite de visualizações, criptografia e frase secreta, e os limites que ela não resolve.",
  lead: "Uma nota autodestrutiva é um link que deixa de funcionar depois de um prazo ou de um número de visualizações.",
  highlights: [
    { title: "Prazo e visualizações", text: "De 1 a 30 dias e de 1 a 50 visualizações, sem conta." },
    { title: "Criptografada", text: "O texto é cifrado com o AES-256-GCM antes de ser guardado." },
    { title: "Frase secreta", text: "A frase faz parte da chave e nunca é guardada." },
  ],
  sections: [
    {
      title: "Resumo",
      paragraphs: [
        "Uma nota autodestrutiva é um texto guardado atrás de um link que para de funcionar. Você escreve o texto, escolhe por quanto tempo ele fica disponível e quantas vezes pode ser aberto, e recebe um link para enviar. Depois do prazo ou do limite de visualizações, o link não mostra mais nada.",
        "No Nota Segura - BR, a nota dura de 1 a 30 dias e pode ser aberta de 1 a 50 vezes. Tudo funciona sem conta: não é preciso informar nome nem e-mail. A nota é útil para enviar um dado sensível que não deve ficar guardado em um histórico de conversa.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "Quando você cria a nota, o texto é enviado ao servidor por HTTPS. No servidor, ele é cifrado com o AES-256-GCM, um padrão moderno de criptografia que também protege boa parte da internet. O banco de dados guarda o texto cifrado, junto com o prazo e o limite de visualizações.",
        "Cada nota tem uma data de expiração. Quando ela chega, o banco de dados apaga a nota automaticamente. Cada vez que alguém abre o link, uma visualização é contada; quando o limite é atingido, a nota não pode mais ser aberta, mesmo que o prazo ainda não tenha acabado.",
        "Assim, o segredo fica disponível só pelo tempo necessário. Se o link aparecer em um e-mail antigo ou em um backup, ele já não leva a lugar nenhum.",
      ],
    },
    {
      title: "O papel da frase secreta",
      paragraphs: [
        "Você pode definir uma frase secreta ao criar a nota. Ela faz parte da chave de criptografia: o servidor transforma a frase em uma chave de 256 bits com o scrypt, uma função de derivação de chave que tem o mesmo papel do PBKDF2. Essas funções são lentas de propósito, para que adivinhar a frase por tentativa e erro saia caro.",
        "A frase secreta nunca é guardada. Por isso, ninguém consegue recuperá-la: se a pessoa esquecer a frase, a nota não pode ser lida. Sem a frase certa, a verificação do AES-256-GCM falha e a nota não é exibida.",
        "Se você não define uma frase, a chave vem de uma frase padrão guardada no servidor. A nota continua cifrada no banco de dados, mas qualquer pessoa com o link consegue abri-la. Com uma frase secreta enviada por outro canal, o link sozinho não basta.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "A nota não serve para guardar informações por muito tempo, porque ela some no prazo escolhido. Para guardar senhas e documentos de forma permanente, use um gerenciador de senhas ou um cofre digital. A nota é um meio de transporte, não um arquivo.",
        "Ela é uma boa escolha para dados que só precisam ser lidos uma vez ou por pouco tempo:",
      ],
      items: [
        "Uma senha temporária ou um código de acesso para um colega ou um cliente.",
        "Uma chave de API ou um token que vai ser trocado logo depois.",
        "Dados bancários ou documentos pessoais que não devem ficar em um chat.",
        "Qualquer texto que você não quer ver guardado no histórico de um e-mail.",
      ],
    },
    {
      title: "Limites",
      paragraphs: [
        "Uma nota autodestrutiva não faz milagre. Qualquer pessoa com o link, e com a frase secreta, se houver uma, consegue ler a nota enquanto ela existe. Por isso, envie o link só para quem deve recebê-lo e prefira 1 visualização quando só uma pessoa vai ler.",
        "Quem lê a nota pode copiar o texto ou fazer uma captura de tela. A nota controla o caminho do segredo, não o que acontece depois que ele é lido. Para senhas, peça que a pessoa troque a senha depois do primeiro uso.",
        "Por fim, a nota é cifrada no servidor, e não no seu aparelho. Para entender a diferença, leia o guia sobre criptografia de ponta a ponta.",
      ],
    },
  ],
  algorithms: ["aes-gcm", "pbkdf2"],
  related: ["como-enviar-uma-senha-com-seguranca", "o-que-e-criptografia-de-ponta-a-ponta"],
  publishedAt: "2026-10-31",
};
