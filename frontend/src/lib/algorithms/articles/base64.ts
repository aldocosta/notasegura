import type { Article } from "../types";

export const base64: Article = {
  id: "base64",
  description:
    "O que é Base64, como ele transforma bytes em texto, onde aparece (e-mail, JWT, data URLs) e por que não protege nenhum segredo.",
  lead: "Uma forma de escrever bytes com letras e números. Parece embaralhado, mas qualquer pessoa desfaz em um segundo.",
  highlights: {
    kind: "Só muda o formato dos dados, sem esconder nada.",
    safety: "Não protege um segredo: qualquer pessoa decodifica.",
    key: "Não usa chave. A tabela de 64 caracteres é pública.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "Base64 é uma codificação: uma regra para representar bytes quaisquer usando apenas 64 caracteres seguros, que passam por qualquer sistema de texto. Ela está definida na RFC 4648.",
        "Muitos canais foram feitos para texto, como o e-mail, o JSON e os endereços da web. Um arquivo de imagem ou uma chave de criptografia contêm bytes que esses canais não aceitam. O Base64 resolve isso: transforma os bytes em texto, e o destino transforma o texto de volta nos mesmos bytes.",
        "O Base64 não é criptografia. Não existe chave, e a regra é pública. Ele só muda a aparência dos dados.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "O alfabeto tem 64 caracteres: as letras de A a Z, as letras de a a z, os dígitos de 0 a 9, e os sinais + e /. Como 64 é dois elevado a seis, cada caractere representa exatamente 6 bits.",
        "O texto é lido em grupos de 3 bytes, ou 24 bits. Cada grupo vira 4 grupos de 6 bits, e cada grupo de 6 bits vira um caractere do alfabeto. Quando o último grupo tem menos de 3 bytes, o resultado é completado com um ou dois sinais =.",
        "Como 3 bytes viram 4 caracteres, o resultado fica cerca de 33% maior que o original.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha Base64 e digite \"olá\". Em UTF-8, essa palavra tem 4 bytes, porque a letra \"á\" ocupa 2 bytes. O resultado é b2zDoQ==. Os dois sinais = no fim indicam que o último grupo tinha só 1 byte.",
        "Clique em \"Decifrar\" e a palavra volta, sem nenhuma chave. Qualquer site ou terminal faz o mesmo: basta colar b2zDoQ== em um decodificador de Base64.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O Base64 aparece em muitos lugares do dia a dia:",
      ],
      items: [
        "Anexos de e-mail, pelo padrão MIME.",
        "Data URLs, que colocam uma imagem pequena direto no código de uma página.",
        "O JWT, o token de login de muitos sites, que usa a variante Base64url, com - e _ no lugar de + e /.",
        "O cabeçalho HTTP Basic, que envia usuário e senha em Base64.",
        "Chaves, certificados e textos cifrados, como os que o playground mostra para o AES e o RSA.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é simples, rápido, sem perdas e suportado por todas as linguagens. Ele permite enviar qualquer dado binário por um canal de texto.",
        "Pontos fracos: os dados ficam um terço maiores. E o risco mais comum é confundir Base64 com proteção. Um texto em Base64 parece ilegível, mas não esconde nada. O conteúdo de um JWT pode ser lido por qualquer pessoa que tenha o token. Uma senha enviada pelo HTTP Basic sem HTTPS pode ser lida por quem observa a rede.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o Base64 para transportar bytes por canais de texto: anexos, JSON, URLs (com a variante Base64url) ou para mostrar chaves e textos cifrados na tela.",
        "Nunca use o Base64 para esconder uma senha, um token ou um dado pessoal. Se a informação é secreta, cifre primeiro com um algoritmo como o AES-256-GCM. Depois, se precisar, codifique o resultado em Base64 para transportá-lo.",
      ],
    },
  ],
  related: ["sha-256", "aes-gcm"],
  publishedAt: "2026-10-30",
};
