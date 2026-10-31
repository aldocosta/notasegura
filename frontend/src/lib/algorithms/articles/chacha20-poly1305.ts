import type { Article } from "../types";

export const chacha20Poly1305: Article = {
  id: "chacha20-poly1305",
  description:
    "Como funciona o ChaCha20-Poly1305, a cifra autenticada do TLS 1.3 e do WireGuard, com exemplo, nonce e diferenças para o AES-GCM.",
  lead: "Uma cifra moderna e autenticada que é rápida em qualquer processador, mesmo sem instruções especiais para o AES.",
  highlights: {
    kind: "A mesma chave secreta cifra e decifra o texto.",
    safety: "É seguro quando a chave fica secreta e o nonce nunca se repete.",
    key: "Uma chave aleatória de 256 bits e um nonce de 12 bytes.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "ChaCha20-Poly1305 é uma cifra autenticada: ela esconde o texto e, ao mesmo tempo, permite detectar qualquer alteração. Ela combina duas peças criadas pelo criptógrafo Daniel J. Bernstein. O ChaCha20, de 2008, é uma cifra de fluxo, e o Poly1305, de 2005, é um código de autenticação.",
        "A combinação foi padronizada pela IETF, o grupo que define os protocolos da internet. A versão atual do padrão é o RFC 8439, de 2018. Hoje ela é a principal alternativa ao AES-GCM, e as duas cumprem o mesmo papel.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "O ChaCha20 parte de uma chave de 256 bits, de um nonce de 12 bytes e de um contador. Ele mistura esses valores em 20 rodadas que usam só três operações: soma, rotação de bits e XOR. O resultado é um fluxo de bytes que parece aleatório, e esse fluxo é combinado com o texto usando XOR.",
        "Em seguida, o Poly1305 calcula uma etiqueta (tag) de 16 bytes sobre o texto cifrado, usando uma chave de uso único derivada da própria chave e do nonce. Na hora de decifrar, a tag é conferida antes de tudo. Se um bit mudou, a operação falha.",
        "O nonce (number used once, ou número usado uma vez) não precisa ser secreto, mas nunca pode se repetir com a mesma chave.",
      ],
      items: [
        "Chave: 256 bits aleatórios, secretos.",
        "Nonce: 12 bytes, públicos e únicos para cada mensagem.",
        "Tag: 16 bytes que provam que nada foi alterado.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha ChaCha20-Poly1305 e cifre a palavra \"segredo\". Ela tem 7 bytes, e o resultado tem 23: 7 bytes de texto cifrado e 16 bytes de tag. O playground mostra a chave e o nonce, gerados de novo a cada clique.",
        "Clique em \"Decifrar\" e a palavra volta. A implementação deste playground foi conferida com o exemplo oficial do RFC 8439, que cifra uma frase sobre protetor solar e publica o resultado byte a byte.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O ChaCha20-Poly1305 é uma das cifras recomendadas do TLS 1.3, o protocolo do HTTPS. O Google passou a usá-lo em 2014 para acelerar o HTTPS em celulares Android, que na época não tinham instruções de hardware para o AES.",
        "Ele também é a única cifra do WireGuard, uma VPN moderna, e uma das opções padrão do SSH. Muitas bibliotecas de criptografia, como a libsodium, o oferecem como primeira escolha.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é rápido em software, inclusive em processadores simples. Como usa só soma, rotação e XOR, roda em tempo constante com facilidade, o que dificulta ataques que medem o tempo de execução. A chave de 256 bits está fora do alcance de qualquer ataque por força bruta.",
        "Pontos fracos: como no AES-GCM, repetir o nonce com a mesma chave é grave. Um atacante passa a combinar os textos cifrados e pode forjar mensagens. Um nonce de 12 bytes aleatórios é seguro para muitas mensagens, mas não para bilhões com a mesma chave; para isso existe a variante XChaCha20, com nonce de 24 bytes. Em processadores com instruções de AES, o AES-GCM costuma ser mais rápido.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o ChaCha20-Poly1305 quando precisar de criptografia autenticada em dispositivos sem aceleração de AES, como celulares antigos e placas pequenas, ou quando quiser uma implementação simples e em tempo constante.",
        "Use uma biblioteca conhecida, gere um nonce novo para cada mensagem e guarde-o junto com o texto cifrado. Se o sistema já usa AES-GCM com aceleração de hardware, não há motivo de segurança para trocar: os dois são considerados seguros.",
      ],
    },
  ],
  related: ["aes-gcm", "aes-ctr"],
  publishedAt: "2026-10-30",
};
