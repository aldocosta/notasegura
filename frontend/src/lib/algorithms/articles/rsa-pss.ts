import type { Article } from "../types";

export const rsaPss: Article = {
  id: "rsa-pss",
  description:
    "Como funciona o RSA-PSS, a assinatura RSA com sal aleatório exigida pelo TLS 1.3, e a diferença para o antigo PKCS#1 v1.5.",
  lead: "A forma moderna de assinar com RSA: um preenchimento com sal aleatório e uma prova de segurança.",
  highlights: {
    kind: "A chave privada assina e a chave pública confere.",
    safety: "É seguro com chaves de pelo menos 2048 bits.",
    key: "Um par de chaves RSA de 2048 bits, novo a cada vez no playground.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "RSA-PSS é o algoritmo de assinatura digital RSA com o preenchimento PSS (Probabilistic Signature Scheme). O PSS foi proposto por Mihir Bellare e Phillip Rogaway em 1996, os mesmos autores do OAEP, e entrou no padrão PKCS #1, hoje publicado como RFC 8017.",
        "O RSA serve tanto para cifrar quanto para assinar, mas cada uso tem o seu preenchimento: o OAEP para cifrar e o PSS para assinar.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "Para assinar, o algoritmo calcula o hash da mensagem, mistura esse hash com um sal aleatório e monta um bloco do tamanho da chave. Depois, aplica a operação RSA com a chave privada. Para conferir, quem recebe aplica a operação RSA com a chave pública e checa se o bloco corresponde ao hash da mensagem.",
        "Com uma chave de 2048 bits, a assinatura tem 256 bytes. Por causa do sal, assinar a mesma mensagem duas vezes gera assinaturas diferentes, e as duas são válidas. O PSS tem uma prova formal de segurança, que o preenchimento antigo não tem.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha RSA-PSS, digite um texto e clique em \"Assinar\". O navegador gera um par de chaves de 2048 bits, usa o SHA-256 e um sal de 32 bytes, e mostra a chave pública e a assinatura de 256 bytes.",
        "Clique em \"Verificar\" para conferir. Depois troque uma letra no campo de verificação: a assinatura deixa de conferir. Gerar as chaves RSA leva um instante a mais que as chaves de curvas elípticas.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O TLS 1.3, versão atual do protocolo do HTTPS, exige o PSS sempre que o servidor prova a sua identidade com uma chave RSA durante a conexão. Ele também aparece em documentos e e-mails assinados, em sistemas de identidade e em atualizações de software.",
        "Muitos certificados ainda são assinados com o preenchimento antigo, o PKCS#1 v1.5, por compatibilidade. Esse formato é determinístico e não tem prova de segurança, e verificações mal implementadas dele já permitiram falsificar assinaturas.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é baseado no RSA, que existe em todos os sistemas, tem prova de segurança e é exigido por protocolos modernos. Conferir uma assinatura RSA é muito rápido.",
        "Pontos fracos: as chaves e as assinaturas são grandes, e gerar chaves e assinar é mais lento que com curvas elípticas. Chaves menores que 2048 bits não são recomendadas. E, como todo o RSA, um computador quântico grande o quebraria.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o RSA-PSS quando precisar de assinaturas RSA em um sistema novo ou quando um protocolo exigir, como o TLS 1.3. Use chaves de 2048 bits ou mais e o SHA-256.",
        "Se não houver exigência de RSA, o Ed25519 ou o ECDSA oferecem a mesma segurança com chaves e assinaturas menores. Não use o OAEP para assinar, e evite o PKCS#1 v1.5 em sistemas novos.",
      ],
    },
  ],
  related: ["rsa-oaep", "ecdsa"],
  publishedAt: "2026-10-30",
};
