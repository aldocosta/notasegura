import type { Guide } from "../types";

export const aesGcmOuChacha20Poly1305: Guide = {
  slug: "aes-gcm-ou-chacha20-poly1305",
  kind: "Comparação",
  title: "AES-256-GCM ou ChaCha20-Poly1305: qual escolher?",
  description:
    "AES-256-GCM e ChaCha20-Poly1305 lado a lado: chave, nonce, tag, velocidade com e sem aceleração no processador e onde cada um é usado.",
  lead: "Os dois são cifras modernas e seguras; a escolha depende do processador que vai rodar o código.",
  highlights: [
    { title: "Os dois são seguros", text: "Cifram e detectam alterações, com chaves de 256 bits." },
    { title: "AES com hardware", text: "Processadores com instruções AES-NI deixam o AES muito rápido." },
    { title: "ChaCha20 sem hardware", text: "Em aparelhos sem essas instruções, o ChaCha20 é mais rápido e não usa tabelas." },
  ],
  sections: [
    {
      title: "Resumo",
      paragraphs: [
        "O AES-256-GCM e o ChaCha20-Poly1305 resolvem o mesmo problema: cifrar um texto com uma chave secreta e perceber se alguém mexeu no resultado. Os dois são cifras AEAD, sigla em inglês para criptografia autenticada com dados associados. Na prática, isso quer dizer que eles cifram e, ao mesmo tempo, detectam qualquer alteração.",
        "Nenhum dos dois tem ataque prático conhecido. A diferença está na velocidade em cada tipo de processador. Onde o hardware acelera o AES, o AES-256-GCM costuma ser o mais rápido. Onde não acelera, como em celulares mais simples e em chips pequenos, o ChaCha20-Poly1305 ganha.",
      ],
    },
    {
      title: "Como cada um funciona",
      paragraphs: [
        "O AES é uma cifra de bloco: ele embaralha blocos de 16 bytes em 14 rodadas, quando a chave tem 256 bits. O modo GCM transforma o AES em um gerador de fluxo, que cifra um contador e combina o resultado com o texto por XOR. Em paralelo, o GCM calcula uma tag de autenticação de 16 bytes.",
        "O ChaCha20 é uma cifra de fluxo criada por Daniel Bernstein. Ele mistura a chave, um contador e o nonce em 20 rodadas que usam só somas, rotações de bits e XOR. O Poly1305 calcula a tag de 16 bytes que prova que nada mudou. Como não usa tabelas de consulta, o ChaCha20 roda em tempo constante: o tempo de cada operação não depende dos dados secretos.",
        "O AES feito só em software, sem instruções próprias, costuma usar tabelas de consulta. O tempo de acesso a essas tabelas pode vazar pedaços da chave para quem mede o tempo com precisão. Por isso, o AES precisa de cuidado extra quando o processador não tem as instruções AES-NI, da Intel e da AMD, ou as instruções de criptografia do ARMv8.",
        "Nos dois casos, a chave tem 256 bits e o nonce, o número que deve mudar a cada mensagem, tem 12 bytes. O nonce pode ser público, mas nunca pode se repetir com a mesma chave. Se repetir, um atacante consegue combinar dois textos cifrados e até forjar mensagens.",
        "Vale lembrar do AES-256-CBC, um modo mais antigo do AES. Ele cifra, mas não detecta alterações sozinho: precisa de um HMAC separado. Em sistemas novos, prefira um dos dois modos AEAD desta página.",
      ],
    },
    {
      title: "Comparação lado a lado",
      paragraphs: [
        "A tabela resume as diferenças mais importantes. Os valores de tamanho são os mesmos usados no TLS 1.3, o protocolo do cadeado do navegador.",
      ],
      table: {
        caption: "AES-256-GCM e ChaCha20-Poly1305 comparados",
        columns: ["Critério", "AES-256-GCM", "ChaCha20-Poly1305"],
        rows: [
          ["Tipo", "Cifra de bloco no modo GCM (AEAD)", "Cifra de fluxo com Poly1305 (AEAD)"],
          ["Tamanho da chave", "256 bits", "256 bits"],
          ["Nonce", "12 bytes", "12 bytes (24 bytes no XChaCha20)"],
          ["Tag de autenticação", "16 bytes", "16 bytes"],
          ["Velocidade com aceleração no processador", "Muito rápido com AES-NI ou ARMv8", "Rápido, mas em geral atrás do AES acelerado"],
          ["Velocidade sem aceleração", "Mais lento, e difícil de fazer em tempo constante", "Rápido, em tempo constante"],
          ["Onde é usado", "TLS 1.3, SSH, VPNs IPsec, armazenamento", "TLS 1.3, WireGuard, SSH, Chrome no Android"],
        ],
      },
    },
    {
      title: "Quando escolher cada um",
      paragraphs: [
        "Escolha o AES-256-GCM em servidores e computadores com processadores recentes, que quase sempre têm instruções para o AES. Ele também é a opção mais aceita em normas e auditorias, porque é um padrão do NIST, o instituto de padrões dos Estados Unidos.",
        "Escolha o ChaCha20-Poly1305 em aparelhos sem aceleração para o AES, como celulares de entrada, roteadores e sensores. Foi por isso que o Google adotou o ChaCha20-Poly1305 no Chrome para Android em 2014: nesses aparelhos, as páginas com HTTPS abriam mais rápido e gastavam menos bateria. O WireGuard, uma VPN moderna, usa só o ChaCha20-Poly1305.",
        "Cuide do nonce nos dois casos. Com nonces aleatórios de 12 bytes, o NIST limita o AES-GCM a 2^32 mensagens por chave, para que a chance de repetir um nonce continue desprezível. Se o sistema precisa sortear nonces para um volume muito grande de mensagens, use o XChaCha20-Poly1305, uma variante com nonce de 24 bytes, que pode ser sorteado sem esse limite prático.",
      ],
      items: [
        "Servidor ou computador recente: AES-256-GCM.",
        "Celular simples, roteador ou chip pequeno: ChaCha20-Poly1305.",
        "Muitas mensagens com nonce sorteado: XChaCha20-Poly1305.",
        "Dúvida: use o que a sua biblioteca oferece por padrão no TLS 1.3.",
      ],
    },
    {
      title: "Conclusão",
      paragraphs: [
        "Não existe um vencedor em segurança: os dois são seguros quando a chave é secreta e o nonce nunca se repete. Escolha o AES-256-GCM onde o hardware acelera o AES, e o ChaCha20-Poly1305 nos aparelhos sem essa aceleração. Em qualquer caso, use uma biblioteca conhecida e não escreva a cifra do zero.",
        "O Nota Segura - BR usa o AES-256-GCM para cifrar cada nota. Você pode testar os dois algoritmos no playground das páginas de cada um e ver que a chave e o nonce, que o playground do AES-256-GCM mostra como \"IV\", mudam a cada clique.",
      ],
    },
  ],
  algorithms: ["aes-gcm", "chacha20-poly1305", "aes-cbc"],
  related: ["criptografia-hash-ou-codificacao", "rsa-ou-curvas-elipticas"],
  publishedAt: "2026-10-31",
};
