import type { Guide } from "../types";

export const comoEnviarUmaSenhaComSeguranca: Guide = {
  slug: "como-enviar-uma-senha-com-seguranca",
  kind: "Guia prático",
  title: "Como enviar uma senha com segurança",
  description:
    "Por que e-mail e chat são maus lugares para uma senha, e como enviá-la com um link que expira, uma frase secreta e outro canal.",
  lead: "Uma senha enviada por e-mail ou chat fica guardada por anos; uma nota que expira deixa de abrir depois do prazo ou do limite de visualizações.",
  highlights: [
    { title: "Evite o histórico", text: "E-mail e chat guardam a senha em históricos, backups e notificações." },
    { title: "Use um link que expira", text: "A nota deixa de abrir depois do prazo ou do limite de visualizações." },
    { title: "Separe os canais", text: "Envie a frase secreta por outro canal, como uma ligação." },
  ],
  sections: [
    {
      title: "Resumo",
      paragraphs: [
        "Mandar uma senha por e-mail ou por aplicativo de mensagens é rápido, mas deixa a senha guardada em vários lugares por muito tempo. Um jeito melhor é enviar um link que expira, protegido por uma frase secreta que vai por outro canal. Assim, a senha fica disponível só pelo tempo necessário, e quem encontrar apenas o link não consegue lê-la.",
        "Este guia explica o problema, mostra o passo a passo com uma nota autodestrutiva e lista os cuidados que valem para qualquer método.",
      ],
    },
    {
      title: "Por que o e-mail e o chat são arriscados",
      paragraphs: [
        "Uma mensagem de e-mail fica na caixa de saída de quem enviou, na caixa de entrada de quem recebeu e, muitas vezes, nos servidores dos dois provedores. Ela também entra nos backups automáticos e pode ser encaminhada sem querer. Anos depois, a senha continua lá, no histórico, à espera de quem invadir uma dessas contas.",
        "Os aplicativos de mensagens têm o mesmo problema. O histórico da conversa fica no celular, no computador e, em muitos casos, em um backup na nuvem. A senha ainda pode aparecer inteira na notificação da tela bloqueada, à vista de quem estiver por perto.",
        "Nada disso exige um ataque sofisticado. Basta alguém acessar uma conta antiga, um celular desbloqueado ou um backup esquecido. Quanto mais tempo a senha fica guardada, maior a chance de alguém encontrá-la.",
      ],
    },
    {
      title: "Um link que expira",
      paragraphs: [
        "Uma nota autodestrutiva troca a senha por um link. No Nota Segura - BR, você escolhe quanto tempo a nota dura, de 1 a 30 dias, e quantas vezes ela pode ser aberta, de 1 a 50 visualizações. O texto é enviado ao servidor por HTTPS e cifrado lá com o AES-256-GCM. Quando o prazo acaba, a nota é apagada do banco de dados; quando o limite de visualizações é atingido, ela não abre mais.",
        "A frase secreta é uma camada a mais. Ela faz parte da chave que cifra a nota: o servidor transforma a frase em chave com uma função de derivação, o scrypt, que tem o mesmo papel do PBKDF2. A frase não é guardada. Sem ela, o link sozinho não abre a nota.",
        "O segredo está em separar o link da frase. Envie o link por um canal e a frase secreta por outro canal, como uma ligação telefônica ou uma mensagem em outro aplicativo. Quem interceptar só um dos dois não consegue ler a senha.",
      ],
    },
    {
      title: "Passo a passo",
      paragraphs: ["Siga estes passos para enviar uma senha com uma nota:"],
      items: [
        "Passo 1: Escreva na nota apenas a senha, sem o nome de usuário e sem o endereço do sistema.",
        "Passo 2: Escolha o menor prazo que funciona para a pessoa, por exemplo 1 dia, e 1 visualização.",
        "Passo 3: Defina uma frase secreta que a pessoa consiga anotar sem erro.",
        "Passo 4: Crie a nota e envie o link pelo canal de sempre, como o e-mail ou o chat.",
        "Passo 5: Passe a frase secreta por outro canal, como uma ligação.",
        "Passo 6: Peça que a pessoa troque a senha no primeiro acesso.",
      ],
    },
    {
      title: "Cuidados que valem sempre",
      paragraphs: [
        "Nunca envie o nome de usuário, a senha e o endereço do sistema na mesma mensagem. Juntos, eles entregam o acesso completo a quem encontrar a mensagem. Separados, cada pedaço vale pouco.",
        "Peça que a pessoa troque a senha depois do primeiro uso. Assim, mesmo que a senha original tenha ficado em algum lugar, ela já não serve para nada. Se o sistema permitir, use uma senha temporária que obriga a troca no primeiro login.",
        "Em uma empresa, prefira a função de compartilhamento do gerenciador de senhas da equipe, quando houver um. Ele controla quem tem acesso, registra o compartilhamento e permite revogar o acesso depois. A nota autodestrutiva é útil para enviar algo a quem está fora desse sistema, como um cliente ou um fornecedor.",
        "Lembre-se também dos limites. Quem abre a nota pode copiar o texto ou fazer uma captura de tela. A nota protege o caminho da senha, não o que a pessoa faz com ela depois.",
      ],
    },
  ],
  algorithms: ["aes-gcm", "pbkdf2"],
  related: ["o-que-e-uma-nota-autodestrutiva", "o-que-e-criptografia-de-ponta-a-ponta"],
  publishedAt: "2026-10-31",
};
