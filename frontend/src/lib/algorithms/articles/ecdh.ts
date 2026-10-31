import type { Article } from "../types";

export const ecdh: Article = {
  id: "ecdh",
  description:
    "Como funciona o ECDH, a troca de chaves Diffie-Hellman com curvas elípticas que protege o HTTPS, com Ana, Beto e o sigilo futuro.",
  lead: "Duas pessoas trocam só chaves públicas pela internet e, mesmo assim, chegam ao mesmo segredo.",
  highlights: {
    kind: "Dois lados combinam um segredo sem enviá-lo.",
    safety: "É seguro quando as chaves públicas são autenticadas.",
    key: "Um par de chaves P-256 para cada lado, Ana e Beto.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "ECDH (Elliptic Curve Diffie-Hellman) é um método de troca de chaves. A ideia original foi publicada por Whitfield Diffie e Martin Hellman em 1976, com contribuições de Ralph Merkle, e mudou a criptografia: pela primeira vez, duas pessoas podiam combinar um segredo em um canal público.",
        "O ECDH é a versão do Diffie-Hellman com curvas elípticas. Ele não cifra mensagens: ele gera um segredo compartilhado, que depois vira a chave de uma cifra como o AES.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "Ana e Beto criam, cada um, um par de chaves na mesma curva. Eles trocam apenas as chaves públicas. Ana combina a sua chave privada com a chave pública de Beto, e Beto combina a sua chave privada com a chave pública de Ana. Pela matemática das curvas, os dois chegam ao mesmo resultado.",
        "Quem observa a conversa vê as duas chaves públicas, mas não consegue calcular o segredo sem uma das chaves privadas. Em protocolos reais, o segredo passa por uma função de derivação de chave, como o HKDF, antes de virar a chave da cifra.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha ECDH, digite um texto e clique em \"Encriptar\". O navegador cria as chaves de Ana e de Beto e mostra as duas chaves públicas, com 65 bytes cada. Repare nos valores \"Segredo calculado por Ana\" e \"Segredo calculado por Beto\": são iguais, com 32 bytes.",
        "Ana usa esse segredo como chave AES-GCM para cifrar o texto. Ao clicar em \"Decifrar\", o playground usa o segredo calculado por Beto, e o texto volta. Nenhum dos dois enviou o segredo.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "Toda conexão HTTPS com TLS 1.3 começa com uma troca Diffie-Hellman, em geral com curvas elípticas. O mesmo acontece no SSH, nas VPNs e em aplicativos de mensagens, como o Signal e o WhatsApp, que usam a Curve25519.",
        "Como as chaves de cada conexão são temporárias e descartadas no fim, quem gravar a conversa e roubar a chave do servidor no futuro não consegue decifrá-la. Essa propriedade se chama sigilo futuro (forward secrecy).",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: permite combinar chaves em um canal público, é rápido, usa chaves pequenas e dá sigilo futuro quando as chaves são temporárias.",
        "Pontos fracos: o ECDH sozinho não diz com quem você está falando. Um atacante no meio do caminho, o chamado ataque do homem no meio, pode fazer uma troca com Ana e outra com Beto e ler tudo. Por isso, os protocolos assinam as chaves públicas com certificados ou assinaturas digitais. Além disso, um computador quântico grande quebraria o ECDH; os navegadores já combinam o ECDH com o algoritmo pós-quântico ML-KEM.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o ECDH, por meio de um protocolo pronto como o TLS, para combinar chaves entre duas partes que só têm um canal público. Use chaves temporárias para cada sessão, autentique as chaves públicas e passe o segredo por uma função de derivação antes de usá-lo.",
        "Evite montar um protocolo próprio: a troca de chaves é a parte em que pequenos erros mais causam falhas graves.",
      ],
    },
  ],
  related: ["ecdsa", "aes-gcm"],
};
