import type { Article } from "../types";

export const ecdsa: Article = {
  id: "ecdsa",
  description:
    "Como funciona o ECDSA, a assinatura digital com curvas elípticas usada em HTTPS, passkeys e Bitcoin, e o erro que expôs o PlayStation 3.",
  lead: "Assinatura digital com curvas elípticas: chaves pequenas, assinaturas curtas e uma regra que não pode ser quebrada.",
  highlights: {
    kind: "A chave privada assina e a chave pública confere.",
    safety: "É seguro quando cada assinatura usa um número secreto novo e imprevisível.",
    key: "Um par de chaves na curva P-256, novo a cada vez no playground.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "ECDSA (Elliptic Curve Digital Signature Algorithm) é um algoritmo de assinatura digital baseado em curvas elípticas. A criptografia com curvas elípticas foi proposta de forma independente por Neal Koblitz e Victor Miller em 1985, e o ECDSA virou padrão nos anos 1990.",
        "Uma assinatura digital prova duas coisas: que a mensagem não mudou e que ela foi assinada por quem tem a chave privada. Qualquer pessoa confere a assinatura com a chave pública, mas só o dono da chave privada consegue assinar.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "Uma curva elíptica é um conjunto de pontos que permite uma operação de soma entre pontos. Multiplicar um ponto por um número grande é rápido, mas descobrir esse número a partir do resultado é extremamente difícil. A chave privada é o número, e a chave pública é o ponto resultante.",
        "Para assinar, o algoritmo calcula o hash da mensagem, escolhe um número secreto novo e gera dois valores, chamados r e s. Na curva P-256, padronizada pelo NIST, a assinatura tem 64 bytes. Uma chave de 256 bits oferece segurança parecida com a de uma chave RSA de 3072 bits.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha ECDSA, digite um texto e clique em \"Assinar\". O navegador cria um par de chaves, mostra a chave pública e a assinatura de 64 bytes. A chave privada não aparece.",
        "Clique em \"Verificar\" e a assinatura confere. Agora troque uma letra em \"Texto para verificar\" e verifique de novo: a assinatura passa a ser inválida. Assine o mesmo texto duas vezes e as assinaturas serão diferentes, porque cada uma usa um número secreto novo.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O ECDSA está em grande parte dos certificados HTTPS modernos e nas passkeys, o login sem senha padronizado pelo WebAuthn. O Bitcoin usa o ECDSA com outra curva, a secp256k1, para provar quem pode gastar cada moeda.",
        "Ele também aparece em atualizações de software assinadas, em documentos eletrônicos e em sistemas de pagamento com cartão.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: chaves e assinaturas pequenas, rapidez para assinar e suporte em todos os navegadores e sistemas.",
        "Pontos fracos: o número secreto de cada assinatura precisa ser novo e imprevisível. Se ele se repetir, ou se for previsível, qualquer pessoa calcula a chave privada a partir de duas assinaturas. Foi o que aconteceu com o PlayStation 3: em 2010, pesquisadores descobriram que a Sony usava sempre o mesmo número e extraíram a chave que assinava os jogos. Em 2013, uma falha no gerador de números aleatórios do Android expôs chaves de carteiras de Bitcoin pelo mesmo motivo.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o ECDSA quando precisar de assinaturas digitais compatíveis com certificados, passkeys ou sistemas existentes. Use uma biblioteca que gere o número secreto de forma segura ou determinística, como descreve o RFC 6979.",
        "Em sistemas novos, sem exigência de compatibilidade, considere o Ed25519, que elimina o risco do número secreto repetido. Lembre que, como o RSA, o ECDSA seria quebrado por um computador quântico grande.",
      ],
    },
  ],
  related: ["rsa-pss", "ed25519"],
  publishedAt: "2026-10-30",
};
