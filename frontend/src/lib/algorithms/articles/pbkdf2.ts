import type { Article } from "../types";

export const pbkdf2: Article = {
  id: "pbkdf2",
  description:
    "Como o PBKDF2 transforma uma senha em chave com sal e 600.000 iterações, onde ele é usado (Wi-Fi, Django) e por que o Argon2 é melhor.",
  lead: "Uma forma de transformar uma senha em uma chave forte, deixando cada tentativa de adivinhar a senha propositalmente lenta.",
  highlights: {
    kind: "Transforma uma senha em uma chave de tamanho fixo.",
    safety: "É seguro com um sal aleatório e muitas iterações.",
    key: "A senha, um sal aleatório de 16 bytes e o número de iterações.",
  },
  sections: [
    {
      title: "O que é",
      paragraphs: [
        "PBKDF2 (Password-Based Key Derivation Function 2) é uma função de derivação de chave. Ela faz parte do padrão PKCS #5, da RSA Laboratories, publicado pela IETF e hoje mantido como RFC 8018.",
        "Senhas são curtas e previsíveis, e não servem diretamente como chave de criptografia. O PBKDF2 transforma a senha em uma chave do tamanho certo e, principalmente, torna cada tentativa de adivinhação cara para um atacante.",
      ],
    },
    {
      title: "Como funciona",
      paragraphs: [
        "O PBKDF2 aplica o HMAC à senha e a um sal, e depois aplica o HMAC de novo ao resultado, milhares ou milhões de vezes. Os resultados de todas as rodadas são combinados para formar a chave.",
        "O sal é um valor aleatório, diferente para cada senha, guardado junto com o resultado. Ele faz com que duas pessoas com a mesma senha tenham resultados diferentes e impede o uso de tabelas pré-calculadas.",
        "O número de iterações define o custo. A OWASP recomenda 600.000 iterações com HMAC-SHA-256. Para quem digita a senha, isso leva uma fração de segundo. Para quem tenta bilhões de senhas, multiplica o trabalho por 600 mil.",
      ],
    },
    {
      title: "Exemplo",
      paragraphs: [
        "Um exemplo conhecido usa a senha \"password\", o sal \"salt\" e uma única iteração, e gera 120fb6cffcf8b32c43e7225256c4f837a86548c92ccc35480805987cb70be17b com HMAC-SHA-256.",
        "No playground desta página, escolha PBKDF2, digite uma senha e clique em \"Derivar chave\". O navegador gera um sal novo e faz 600.000 iterações. Depois, troque uma letra em \"Texto para verificar\" e clique em \"Verificar\": a chave derivada não confere. É assim que um sistema confere a senha de um usuário sem guardá-la.",
      ],
    },
    {
      title: "Onde é usado",
      paragraphs: [
        "O Wi-Fi com WPA2 pessoal usa o PBKDF2 com 4096 iterações e o nome da rede como sal para transformar a senha do Wi-Fi em chave. O framework Django usa o PBKDF2 com SHA-256 para guardar as senhas dos usuários por padrão.",
        "Gerenciadores de senhas, como o Bitwarden, usam o PBKDF2 para transformar a senha mestra em chave, e muitos sistemas de criptografia de arquivos fazem o mesmo. O PBKDF2 também é aceito em normas do governo americano, o que ajuda em ambientes regulados.",
      ],
    },
    {
      title: "Pontos fortes e fracos",
      paragraphs: [
        "Pontos fortes: é simples, padronizado, existe no navegador e em todas as linguagens, e o custo pode crescer com o tempo, aumentando as iterações.",
        "Pontos fracos: o PBKDF2 usa pouca memória. Placas de vídeo e chips especializados conseguem rodar milhares de tentativas em paralelo, o que reduz a proteção. Funções mais novas, como o Argon2, vencedor de uma competição internacional de 2015, e o scrypt exigem muita memória em cada tentativa e resistem melhor a esse tipo de ataque.",
      ],
    },
    {
      title: "Quando usar",
      paragraphs: [
        "Para guardar senhas em um sistema novo, prefira o Argon2id. Use o PBKDF2 quando ele é o que a plataforma oferece, como no navegador, ou quando uma norma o exige.",
        "Se usar o PBKDF2, gere um sal aleatório de pelo menos 16 bytes para cada senha, use pelo menos 600.000 iterações com HMAC-SHA-256, guarde o sal e o número de iterações junto com o resultado e compare os resultados em tempo constante.",
      ],
    },
  ],
  related: ["sha-256", "hmac-sha-256"],
  publishedAt: "2026-10-30",
};
