import type { Article } from "../types";

export const rsaOaep: Article = {
  id: "rsa-oaep",
  description:
    "Como funciona o RSA-OAEP, a criptografia de chave pública: chave pública e privada, limite de 190 bytes, uso com AES e risco quântico.",
  lead: "Criptografia com duas chaves: qualquer pessoa cifra com a chave pública, e só o dono da chave privada consegue ler.",
  highlights: {
    kind: "Uma chave pública cifra e só a chave privada decifra.",
    safety: "É seguro com chaves de pelo menos 2048 bits e com o preenchimento OAEP.",
    key: "Um par de chaves de 2048 bits, novo a cada vez no playground.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "O RSA é um algoritmo de criptografia assimétrica publicado em 1977 por Ron Rivest, Adi Shamir e Leonard Adleman, cujas iniciais dão nome ao método. Assimétrica quer dizer que existem duas chaves diferentes: uma chave pública, que pode ser divulgada, e uma chave privada, que fica só com o dono.",
        "O que a chave pública cifra, só a chave privada decifra. Isso resolve um problema antigo: duas pessoas conseguem trocar segredos sem combinar uma senha antes. OAEP (Optimal Asymmetric Encryption Padding) é o preenchimento que torna o RSA seguro para cifrar dados.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "Para criar as chaves, o computador escolhe dois números primos enormes e multiplica um pelo outro. O produto faz parte da chave pública. Os primos, que permitem calcular a chave privada, ficam em segredo. A segurança do RSA depende de um fato: multiplicar é fácil, mas descobrir os dois primos a partir do produto é extremamente difícil quando eles têm centenas de dígitos.",
        "O RSA puro, sem preenchimento, é determinístico: o mesmo texto sempre gera o mesmo resultado, e isso permite vários ataques. O OAEP, proposto por Mihir Bellare e Phillip Rogaway em 1994, mistura o texto com bytes aleatórios e com um hash antes de aplicar o RSA. Assim, o mesmo texto gera um resultado diferente a cada vez.",
        "O preenchimento ocupa espaço. Com uma chave de 2048 bits (256 bytes) e o hash SHA-256, sobram no máximo 190 bytes para o texto: 256 menos duas vezes 32, menos 2.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "No playground desta página, escolha RSA-OAEP e cifre \"segredo\". O navegador gera um par de chaves novo, mostra a chave pública e cifra o texto. O resultado sempre tem 256 bytes, o mesmo tamanho da chave, seja o texto curto ou longo.",
        "A chave privada não aparece na tela: ela fica só na memória do navegador, para o botão \"Decifrar\" funcionar. Tente cifrar um texto com mais de 190 bytes e o playground mostra um erro, porque o RSA-OAEP não consegue cifrar textos desse tamanho.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "Na prática, o RSA quase nunca cifra os dados em si, porque é lento e só aceita textos curtos. Ele cifra uma chave AES aleatória, e o AES cifra os dados. Esse esquema se chama criptografia híbrida e aparece em e-mail cifrado (PGP e S/MIME), em backups e em serviços de gerenciamento de chaves.",
        "O RSA também é muito usado para assinaturas digitais, por exemplo nos certificados do HTTPS. Mas assinatura usa outro preenchimento, em geral o PKCS#1 v1.5 ou o PSS, e não o OAEP. No TLS 1.3, a troca de chaves passou a usar Diffie-Hellman, em geral com curvas elípticas, e o RSA ficou apenas para assinar.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: a chave pública pode ser divulgada sem risco, o que facilita a comunicação com desconhecidos. O RSA é estudado há quase cinquenta anos e existe em todas as plataformas.",
        "Pontos fracos: é muito mais lento que o AES, as chaves são grandes e o texto tem um limite curto. Chaves menores que 2048 bits já não são recomendadas. Além disso, um computador quântico grande, rodando o algoritmo de Shor, conseguiria fatorar o produto dos primos e quebrar o RSA. Esse computador ainda não existe, mas o NIST publicou em 2024 padrões pós-quânticos, como o ML-KEM, para substituir o RSA na troca de chaves.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Use o RSA-OAEP para cifrar uma chave curta para alguém de quem você conhece a chave pública, e depois use o AES para os dados. Use chaves de pelo menos 2048 bits, ou 3072 bits para dados que precisam ficar secretos por muitos anos.",
        "Não use o RSA-OAEP para assinar: use o RSA-PSS ou um algoritmo de assinatura com curvas elípticas. Não use o RSA sem preenchimento, nem o preenchimento antigo PKCS#1 v1.5 para cifrar. Em projetos novos, considere também as opções pós-quânticas.",
      ],
    },
  ],
  related: ["aes-gcm", "sha-256"],
};
