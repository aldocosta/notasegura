import type { Article } from "../types";

export const hmacSha256: Article = {
  id: "hmac-sha-256",
  description:
    "Como funciona o HMAC-SHA-256, o código que prova que uma mensagem não mudou e veio de quem tem a chave, usado em JWT e webhooks.",
  lead: "Um hash com chave secreta: prova que a mensagem não foi alterada e que veio de alguém que conhece a chave.",
  highlights: {
    kind: "Gera um código de autenticação com uma chave secreta.",
    safety: "É seguro quando a chave fica secreta e os códigos são comparados com cuidado.",
    key: "Uma chave secreta aleatória de 256 bits, compartilhada pelos dois lados.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "HMAC (Hash-based Message Authentication Code) é um código de autenticação de mensagem construído a partir de uma função de hash. Ele foi proposto por Mihir Bellare, Ran Canetti e Hugo Krawczyk em 1996 e padronizado no RFC 2104. O HMAC-SHA-256 usa o SHA-256 como hash.",
        "Um hash comum qualquer pessoa calcula. O HMAC precisa de uma chave secreta. Assim, só quem tem a chave consegue gerar um código válido para uma mensagem, e só quem tem a chave consegue conferir.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "O HMAC aplica o hash duas vezes. Primeiro, ele combina a chave com uma constante interna, junta a mensagem e calcula o hash. Depois, combina a chave com outra constante, junta o resultado anterior e calcula o hash de novo. Essa construção evita ataques que afetam a ideia ingênua de calcular o hash da chave seguida da mensagem.",
        "O resultado do HMAC-SHA-256 tem 32 bytes, ou 64 caracteres hexadecimais. Para conferir, quem recebe calcula o HMAC da mensagem com a mesma chave e compara com o código recebido. A comparação deve ser feita em tempo constante, para não revelar, pelo tempo de resposta, quantos bytes estavam certos.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "O RFC 4231 traz exemplos oficiais. Com a chave Jefe e a mensagem \"what do ya want for nothing?\", o resultado é 5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843.",
        "No playground desta página, escolha HMAC-SHA-256, digite um texto e clique em \"Gerar código\". O navegador cria uma chave aleatória e mostra o código. Depois, altere uma letra no campo \"Texto para verificar\" e clique em \"Verificar\": o código não confere mais.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O HMAC está por trás de muitos serviços da internet:",
      ],
      items: [
        "Tokens JWT do tipo HS256, que provam que o token foi emitido pelo servidor.",
        "Assinatura de requisições de APIs, como as da AWS.",
        "Webhooks do GitHub e do Stripe, que enviam um HMAC de cada webhook para o destinatário conferir a origem.",
        "Códigos de autenticação em dois fatores (TOTP), que usam o HMAC com um contador de tempo.",
        "Protocolos como o TLS, para derivar chaves.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é simples, rápido e muito bem estudado. A segurança continua boa mesmo com hashes que têm problemas de colisão, como o SHA-1.",
        "Pontos fracos: os dois lados têm a mesma chave. Por isso, o HMAC prova a quem recebe que a mensagem veio de quem tem a chave, mas não prova a uma terceira pessoa quem escreveu: o próprio destinatário poderia ter gerado o código. Para isso existem as assinaturas digitais. E o HMAC não esconde a mensagem: ele autentica, não cifra.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o HMAC-SHA-256 para conferir que mensagens entre dois sistemas que compartilham uma chave não foram alteradas, como webhooks, tokens e requisições de API.",
        "Gere uma chave aleatória longa, guarde-a fora do código-fonte e compare os códigos com uma função de tempo constante. Se precisar que qualquer pessoa confira sem poder gerar códigos, use uma assinatura digital, como o ECDSA ou o Ed25519.",
      ],
    },
  ],
  related: ["sha-256", "ecdsa"],
  publishedAt: "2026-10-30",
};
