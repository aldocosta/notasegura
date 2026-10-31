import type { Guide } from "../types";

export const oQueECriptografiaDePontaAPonta: Guide = {
  slug: "o-que-e-criptografia-de-ponta-a-ponta",
  kind: "Guia prático",
  title: "O que é criptografia de ponta a ponta",
  description:
    "O que a criptografia de ponta a ponta protege, como ela difere do HTTPS e da criptografia em repouso, e o que ela não esconde.",
  lead: "Na criptografia de ponta a ponta, só os aparelhos de quem conversa têm as chaves, e o servidor não consegue ler as mensagens.",
  highlights: [
    { title: "Só as pontas leem", text: "As chaves ficam nos aparelhos de quem envia e de quem recebe." },
    { title: "Não é só HTTPS", text: "O HTTPS protege o caminho até o servidor, não o servidor." },
    { title: "Metadados aparecem", text: "Quem fala com quem, e quando, continua visível para o serviço." },
  ],
  sections: [
    {
      title: "Resumo",
      paragraphs: [
        "Criptografia de ponta a ponta quer dizer que a mensagem é cifrada no aparelho de quem envia e só é decifrada no aparelho de quem recebe. As chaves ficam nas pontas. O servidor que entrega a mensagem só vê bytes cifrados, e nem a empresa que mantém o serviço consegue ler o conteúdo.",
        "Esse modelo é diferente de outras proteções que também são chamadas de criptografia, como o HTTPS e a criptografia em repouso. Entender a diferença ajuda a saber quem pode ler os seus dados em cada serviço.",
      ],
    },
    {
      title: "Três lugares para cifrar",
      paragraphs: [
        "A criptografia em trânsito protege os dados no caminho entre o seu aparelho e o servidor. É o que faz o TLS, o protocolo por trás do \"s\" do HTTPS e do cadeado do navegador. Quem está na mesma rede Wi-Fi não consegue ler nem alterar o que passa. Mas, quando os dados chegam ao servidor, eles são decifrados, e o servidor lê tudo.",
        "A criptografia em repouso protege os dados guardados no disco do servidor. Se alguém roubar o disco ou uma cópia do banco de dados, verá só dados cifrados. Mas o próprio serviço tem a chave, porque precisa ler os dados para funcionar.",
        "A criptografia de ponta a ponta vai além das duas. A mensagem é cifrada antes de sair do aparelho, com uma chave que o servidor não tem. O servidor guarda e entrega a mensagem, mas não consegue decifrá-la, mesmo que queira ou que seja obrigado.",
      ],
    },
    {
      title: "Como as chaves são combinadas",
      paragraphs: [
        "O desafio é fazer duas pessoas combinarem uma chave secreta sem que o servidor, que passa todas as mensagens, descubra essa chave. A solução é a troca de chaves com curvas elípticas, o ECDH. Cada aparelho tem um par de chaves, publica só a chave pública e calcula, com a própria chave privada e a chave pública do outro, o mesmo segredo compartilhado. O servidor vê as chaves públicas, mas não consegue calcular o segredo.",
        "O protocolo Signal, usado pelo aplicativo Signal, combina várias trocas ECDH e renova as chaves a cada mensagem. Em 2016, o WhatsApp concluiu a adoção desse protocolo para todas as conversas. Com o segredo combinado, cada mensagem é cifrada com uma cifra simétrica, como o AES. Cada pessoa tem uma chave de identidade, que dura muito tempo, e chaves temporárias, que mudam. Assinaturas digitais com curvas elípticas, como o Ed25519, provam que as chaves temporárias vieram do dono da chave de identidade.",
        "Existe um ataque que o ECDH sozinho não resolve: o homem no meio. Um servidor malicioso poderia entregar a sua própria chave de identidade no lugar da chave do contato, e as assinaturas não percebem a troca. Para detectar isso, os aplicativos mostram um código de segurança, um número ou um QR code calculado a partir das chaves de identidade das duas pessoas. É esse código que prova que a chave de identidade pertence mesmo à pessoa: se ele for igual nos dois aparelhos, ninguém está no meio.",
      ],
    },
    {
      title: "O que ela não protege",
      paragraphs: ["A criptografia de ponta a ponta esconde o conteúdo, mas não esconde os metadados e deixa outras coisas de fora:"],
      items: [
        "Os metadados: o serviço ainda sabe quem fala com quem, quando e com que frequência.",
        "Os backups: uma cópia das conversas na nuvem pode ficar fora da criptografia de ponta a ponta, se essa opção não estiver ativada.",
        "Os aparelhos: quem desbloqueia o celular lê as mensagens já decifradas.",
        "A pessoa que recebe: ela pode copiar o texto ou fazer uma captura de tela.",
      ],
    },
    {
      title: "E o Nota Segura - BR?",
      paragraphs: [
        "O Nota Segura - BR não usa criptografia de ponta a ponta. O texto da nota chega ao servidor por HTTPS e é cifrado lá, com o AES-256-GCM. A frase secreta, quando você define uma, também é enviada ao servidor para derivar a chave, e não é guardada. O banco de dados guarda a nota cifrada, que é apagada na data de expiração.",
        "Isso quer dizer que a proteção depende também do servidor. Para a maioria dos segredos do dia a dia, como uma senha temporária, uma nota que expira resolve o problema principal: o segredo não fica guardado em um histórico de conversa. Para conversas que nenhum servidor pode ler, use um aplicativo com criptografia de ponta a ponta e confira o código de segurança do contato.",
      ],
    },
  ],
  algorithms: ["ecdh", "aes-gcm", "ed25519"],
  related: ["como-enviar-uma-senha-com-seguranca", "rsa-ou-curvas-elipticas"],
  publishedAt: "2026-10-31",
};
