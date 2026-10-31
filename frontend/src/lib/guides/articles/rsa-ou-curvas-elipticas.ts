import type { Guide } from "../types";

export const rsaOuCurvasElipticas: Guide = {
  slug: "rsa-ou-curvas-elipticas",
  kind: "Comparação",
  title: "RSA ou curvas elípticas: qual escolher?",
  description:
    "RSA e curvas elípticas comparados: base matemática, tamanho das chaves e assinaturas, velocidade e o risco dos computadores quânticos.",
  lead: "As curvas elípticas dão a mesma segurança do RSA com chaves e assinaturas muito menores.",
  highlights: [
    { title: "Mesma segurança", text: "Uma chave P-256 equivale a uma chave RSA de 3072 bits." },
    { title: "Menos bytes", text: "Uma assinatura Ed25519 tem 64 bytes; uma RSA-2048 tem 256." },
    { title: "Quântico", text: "Um computador quântico grande quebraria os dois." },
  ],
  sections: [
    {
      title: "Resumo",
      paragraphs: [
        "O RSA e as curvas elípticas são as duas famílias de criptografia assimétrica mais usadas. Nas duas, cada pessoa tem uma chave pública, que pode ser divulgada, e uma chave privada, que fica em segredo. Com elas, é possível assinar documentos, combinar chaves pela internet e cifrar pequenos dados.",
        "As duas famílias são seguras quando usadas com chaves do tamanho certo. A diferença está no custo: as curvas elípticas precisam de chaves bem menores para o mesmo nível de segurança, e por isso geram assinaturas menores e chaves mais depressa. Para sistemas novos, as curvas são a escolha mais comum.",
      ],
    },
    {
      title: "Como cada um funciona",
      paragraphs: [
        "O RSA, de 1977, depende da fatoração de números grandes. A chave pública contém o produto de dois números primos enormes, e a chave privada depende desses dois primos. Multiplicar os primos é fácil; descobrir os primos a partir do produto é muito difícil. No playground, o RSA-OAEP cifra textos curtos e o RSA-PSS assina mensagens.",
        "As curvas elípticas dependem de outro problema: o logaritmo discreto em uma curva. A chave privada é um número, e a chave pública é um ponto da curva obtido ao somar um ponto fixo a ele mesmo esse número de vezes. Calcular o ponto é rápido; descobrir o número a partir do ponto é muito difícil. O ECDSA e o Ed25519 assinam mensagens, e o ECDH permite que duas pessoas combinem uma chave secreta.",
        "Os ataques conhecidos contra a fatoração são bem mais eficientes que os ataques contra o logaritmo discreto em curvas. É por isso que o RSA precisa de chaves tão maiores. O NIST, no documento SP 800-57, considera que uma chave RSA de 2048 bits dá cerca de 112 bits de segurança, e uma de 3072 bits, cerca de 128 bits. Uma chave na curva P-256, com 256 bits, já dá cerca de 128 bits.",
      ],
    },
    {
      title: "Comparação lado a lado",
      paragraphs: [
        "A tabela compara as duas famílias para o mesmo nível de segurança, de cerca de 128 bits.",
      ],
      table: {
        caption: "RSA e curvas elípticas comparados",
        columns: ["Critério", "RSA", "Curvas elípticas"],
        rows: [
          ["Base matemática", "Fatoração de números grandes", "Logaritmo discreto em uma curva"],
          ["Chave para cerca de 128 bits de segurança", "3072 bits", "256 bits (P-256 ou Curve25519)"],
          [
            "Tamanho da assinatura",
            "256 bytes com RSA-2048, 384 bytes com RSA-3072",
            "64 bytes no Ed25519; no ECDSA P-256, 64 bytes no formato bruto e cerca de 70 a 72 bytes em DER",
          ],
          ["Velocidade para gerar chaves", "Lenta: é preciso achar dois primos grandes", "Muito rápida"],
          ["Exemplos no playground", "RSA-OAEP e RSA-PSS", "ECDSA, Ed25519 e ECDH"],
          ["Resistência a computadores quânticos", "Nenhuma: o algoritmo de Shor quebra", "Nenhuma: o algoritmo de Shor quebra"],
        ],
      },
    },
    {
      title: "Quando escolher cada um",
      paragraphs: [
        "O Ed25519 tem chaves públicas de 32 bytes e assinaturas de 64 bytes. Uma assinatura ECDSA P-256 tem 64 bytes no formato bruto (r‖s), o mesmo usado pela Web Crypto do navegador, e cerca de 70 a 72 bytes no formato DER, comum em certificados. Uma assinatura RSA-2048 tem 256 bytes, quatro vezes mais que a do Ed25519. Em certificados, tokens e protocolos que trocam muitas assinaturas, essa diferença pesa. Gerar uma chave de curva elíptica leva frações de milissegundo; gerar uma chave RSA de 3072 bits pode levar bem mais, porque o computador precisa sortear e testar números até achar dois primos.",
        "O RSA ainda faz sentido onde a compatibilidade manda. Sistemas antigos, cartões inteligentes e muitos certificados de sites ainda usam RSA, e verificar uma assinatura RSA é rápido. Se você precisa usar RSA, escolha chaves de pelo menos 2048 bits, prefira 3072 bits para dados que precisam ficar secretos por muitos anos, e use os esquemas modernos: OAEP para cifrar e PSS para assinar.",
        "Existe um risco que vale para as duas famílias. O algoritmo de Shor, rodando em um computador quântico grande, resolveria tanto a fatoração quanto o logaritmo discreto. Esse computador ainda não existe, mas dados gravados hoje podem ser decifrados no futuro. Por isso, em 2024, o NIST publicou três padrões pós-quânticos: o ML-KEM (FIPS 203), para combinar chaves, e o ML-DSA (FIPS 204) e o SLH-DSA (FIPS 205), para assinaturas.",
      ],
      items: [
        "Novas assinaturas: Ed25519 ou ECDSA P-256.",
        "Combinar uma chave pela internet: ECDH, de preferência junto com o ML-KEM quando disponível.",
        "Compatibilidade com sistemas antigos: RSA de 3072 bits, com OAEP ou PSS.",
      ],
    },
    {
      title: "Conclusão",
      paragraphs: [
        "Para projetos novos, use curvas elípticas: Ed25519 ou ECDSA P-256 para assinaturas e ECDH para troca de chaves. Elas dão a mesma segurança com menos bytes e menos tempo. Use RSA quando a compatibilidade exigir, com chaves de tamanho adequado. E acompanhe a migração para os algoritmos pós-quânticos, que já começou em navegadores e servidores.",
        "No playground, gere um par de chaves RSA e um par de chaves de curva elíptica, assine a mesma mensagem e compare o tamanho das assinaturas.",
      ],
    },
  ],
  algorithms: ["rsa-oaep", "rsa-pss", "ecdsa", "ed25519", "ecdh"],
  related: ["aes-gcm-ou-chacha20-poly1305", "o-que-e-criptografia-de-ponta-a-ponta"],
  publishedAt: "2026-10-31",
};
