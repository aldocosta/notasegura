import type { Article } from "../types";

export const ed25519: Article = {
  id: "ed25519",
  description:
    "Como funciona o Ed25519, a assinatura digital moderna e determinística usada em chaves SSH, com chaves de 32 bytes e assinaturas de 64.",
  lead: "Uma assinatura digital moderna, rápida e determinística, desenhada para evitar os erros mais comuns de implementação.",
  highlights: {
    kind: "A chave privada assina e a chave pública confere.",
    safety: "É seguro e foi desenhado para ser difícil de usar errado.",
    key: "Uma chave pública de 32 bytes, nova a cada vez no playground.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "Ed25519 é um algoritmo de assinatura digital do tipo EdDSA, que usa a Curve25519 na forma de Edwards. Ele foi publicado em 2011 por Daniel J. Bernstein, Niels Duif, Tanja Lange, Peter Schwabe e Bo-Yin Yang, e padronizado no RFC 8032, em 2017. Em 2023, o NIST também o incluiu no padrão de assinaturas FIPS 186-5.",
        "Ele cumpre o mesmo papel do ECDSA e do RSA-PSS: a chave privada assina, e qualquer pessoa confere com a chave pública.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "A chave privada é um valor aleatório de 32 bytes, e a chave pública é um ponto da curva, também com 32 bytes. A assinatura tem 64 bytes.",
        "A grande diferença em relação ao ECDSA é que a assinatura é determinística. O número secreto de cada assinatura não vem de um gerador aleatório: ele é calculado com o SHA-512 a partir de uma parte da chave privada e da própria mensagem. Assim, a mesma mensagem sempre gera a mesma assinatura, e um gerador aleatório ruim não tem como vazar a chave.",
        "A curva e as fórmulas foram escolhidas para rodar em tempo constante e sem casos especiais, o que dificulta ataques que medem o tempo ou o consumo de energia.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha Ed25519, digite um texto e clique em \"Assinar\". O resultado é uma assinatura de 64 bytes, e a chave pública aparece com 32 bytes. Clique em \"Verificar\" para conferir, e depois troque uma letra para ver a verificação falhar.",
        "Os navegadores passaram a oferecer o Ed25519 na Web Crypto entre 2023 e 2025. Em um navegador antigo, o playground mostra que o algoritmo não é suportado.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O Ed25519 é suportado no SSH desde 2014 e, desde 2023, é o tipo de chave padrão do ssh-keygen; as chaves que começam com ssh-ed25519 estão em todo servidor moderno. Ele também é usado nos endereços .onion da rede Tor, na assinatura de commits do Git, em atualizações de software e em várias criptomoedas.",
        "Protocolos de mensagens seguras, como o Signal, usam a mesma família de curvas para assinaturas e troca de chaves.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é rápido para assinar e conferir, tem chaves e assinaturas pequenas, é determinístico e foi desenhado para evitar erros de implementação. Oferece segurança equivalente a cerca de 128 bits.",
        "Pontos fracos: ainda não é aceito em todos os sistemas antigos, como alguns certificados e dispositivos de hardware. E, como todas as assinaturas com curvas elípticas, seria quebrado por um computador quântico grande.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o Ed25519 como primeira escolha para assinaturas em sistemas novos: chaves SSH, assinatura de arquivos, tokens e mensagens entre serviços.",
        "Use o ECDSA ou o RSA-PSS quando um padrão ou um sistema existente exigir, como em certificados HTTPS antigos. Para dados que precisam continuar protegidos por décadas, acompanhe a adoção das assinaturas pós-quânticas.",
      ],
    },
  ],
  related: ["ecdsa", "sha-512"],
};
