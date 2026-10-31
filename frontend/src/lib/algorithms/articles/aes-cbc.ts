import type { Article } from "../types";

export const aesCbc: Article = {
  id: "aes-cbc",
  description:
    "Como funciona o AES-256-CBC, por que ele não detecta alterações, o que é um ataque de padding oracle e quando trocar pelo GCM.",
  lead: "O mesmo AES em um modo mais antigo: ainda protege o sigilo, mas sozinho não percebe quando alguém altera o texto cifrado.",
  highlights: {
    kind: "A mesma chave secreta cifra e decifra o texto.",
    safety: "É seguro para sigilo quando bem usado, mas precisa de uma verificação extra.",
    key: "Uma chave aleatória de 256 bits e um IV de 16 bytes.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "AES-256-CBC é o algoritmo AES, com chave de 256 bits, usado no modo CBC (Cipher Block Chaining, ou encadeamento de blocos). O AES em si é o mesmo do AES-256-GCM. O que muda é a forma de aplicar o AES a um texto maior que um bloco.",
        "O CBC é um dos modos mais antigos e foi o padrão em muitos sistemas durante décadas. Ele protege o sigilo do texto, mas não foi feito para detectar alterações. Essa diferença explica por que os protocolos modernos preferem o GCM.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "O texto é dividido em blocos de 16 bytes. Antes de cifrar cada bloco, o CBC combina esse bloco com o bloco cifrado anterior usando a operação XOR. Assim, blocos iguais no texto original geram blocos diferentes no resultado.",
        "O primeiro bloco não tem um bloco anterior, então ele é combinado com o IV, um vetor de inicialização de 16 bytes aleatórios. O IV pode ser público, mas precisa ser imprevisível e novo a cada mensagem.",
        "Como o AES só cifra blocos completos, o último bloco é completado com preenchimento PKCS#7. Se faltam 9 bytes, o algoritmo acrescenta 9 bytes com o valor 9. Se o texto já tem um tamanho múltiplo de 16, ele recebe um bloco inteiro de preenchimento, para que a decifração sempre saiba o que remover.",
      ],
      items: [
        "Cifrar é sequencial: cada bloco depende do anterior.",
        "Decifrar pode ser feito em paralelo, porque todos os blocos cifrados já são conhecidos.",
        "Um erro em um bloco cifrado estraga aquele bloco e inverte os mesmos bits no bloco seguinte.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha AES-256-CBC e cifre \"segredo\". O texto tem 7 bytes, e o preenchimento PKCS#7 o completa até 16 bytes. Por isso o resultado tem exatamente um bloco, mesmo com um texto tão curto.",
        "Agora cifre um texto com 16 caracteres simples, como \"abcdefghijklmnop\". O resultado tem 32 bytes: o bloco do texto e um bloco inteiro de preenchimento. Repare também que não existe tag: o CBC não produz nenhuma prova de que o texto cifrado está intacto.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O CBC foi muito usado em versões antigas do TLS, em VPNs, em formatos de arquivo e em bancos de dados. O TLS 1.3 removeu todas as opções com CBC e manteve só modos autenticados, como o GCM. Mesmo assim, muitos sistemas legados e formatos antigos ainda usam o CBC.",
        "Quando o CBC é usado de forma correta, ele vem acompanhado de um HMAC: um código de autenticação calculado com uma segunda chave sobre o IV e o texto cifrado. Essa técnica se chama encrypt-then-MAC. Quem recebe confere o HMAC antes de decifrar.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: com uma chave secreta e um IV aleatório, um atacante que só observa o texto cifrado não descobre o texto original. O modo é simples, bem estudado e disponível em todas as bibliotecas.",
        "Pontos fracos: o CBC não detecta alterações. Quem muda bits do IV muda os mesmos bits do primeiro bloco decifrado, sem conhecer a chave. Pior: se um servidor revela, por uma mensagem de erro ou pelo tempo de resposta, que o preenchimento estava errado, um atacante consegue decifrar a mensagem inteira, byte a byte. Esse é o ataque de padding oracle, descrito por Serge Vaudenay em 2002, e que inspirou ataques reais contra o TLS, como o POODLE e o Lucky Thirteen.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Em um projeto novo, prefira o GCM, que cifra e autentica em uma só operação. Use o CBC apenas quando um sistema existente ou um formato de arquivo exige esse modo.",
        "Se precisar usar o CBC, gere um IV aleatório para cada mensagem, calcule um HMAC sobre o IV e o texto cifrado com uma chave separada, e confira o HMAC antes de decifrar. Nunca mostre ao usuário, nem nos registros, uma mensagem diferente para erro de preenchimento.",
      ],
    },
  ],
  related: ["aes-gcm", "sha-256"],
  publishedAt: "2026-10-30",
};
