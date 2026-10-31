import type { Guide } from "../types";

export const comoGuardarSenhas: Guide = {
  slug: "como-guardar-senhas",
  kind: "Guia prático",
  title: "Como guardar senhas de usuários com segurança",
  description:
    "Por que MD5, SHA-1 e SHA-256 não bastam para senhas, o que é sal e como usar Argon2id, bcrypt, scrypt ou PBKDF2 do jeito certo.",
  lead: "Um sistema nunca deve conseguir ler as senhas dos usuários: ele guarda só um hash lento, com sal.",
  highlights: [
    { title: "Nada de texto puro", text: "Nem texto puro, nem criptografia reversível." },
    { title: "Sal único", text: "Um sal aleatório por usuário derruba as tabelas prontas." },
    { title: "Função lenta", text: "Argon2id, bcrypt, scrypt ou PBKDF2 com muitas iterações." },
  ],
  sections: [
    {
      title: "Resumo",
      paragraphs: [
        "Um sistema que tem login precisa conferir a senha do usuário, mas não precisa saber qual é a senha. Por isso, o certo é guardar só um hash da senha, calculado com uma função lenta e com um sal diferente para cada usuário. No login, o sistema calcula o hash da senha digitada e compara com o hash guardado.",
        "Se o banco de dados vazar, um bom hash de senha transforma cada tentativa de adivinhar uma senha em um trabalho caro. Um hash fraco, ou a senha em texto puro, entrega as contas de todos os usuários de uma vez.",
      ],
    },
    {
      title: "O que nunca fazer",
      paragraphs: [
        "Nunca guarde senhas em texto puro. Qualquer pessoa com acesso ao banco de dados, a um backup ou a um log vê todas as senhas. Como muita gente repete a mesma senha em vários sites, um vazamento afeta também as contas dos usuários em outros serviços.",
        "Também não use criptografia reversível, como cifrar as senhas com o AES. A chave precisa ficar no próprio servidor para o login funcionar, e quem invade o servidor costuma levar a chave junto. Uma senha nunca precisa ser decifrada; ela só precisa ser conferida.",
        "E não use um hash rápido. MD5, SHA-1 e SHA-256 foram feitos para ser rápidos. Um atacante com placas de vídeo testa bilhões de palpites por segundo contra esses hashes, e senhas comuns caem em minutos. Em 2012, o LinkedIn teve milhões de hashes de senhas vazados. Eles eram SHA-1 sem sal, e a maior parte foi descoberta pouco depois.",
      ],
    },
    {
      title: "O sal",
      paragraphs: [
        "Um sal é um valor aleatório, diferente para cada usuário, que entra no cálculo do hash junto com a senha. Ele não é secreto: fica guardado ao lado do hash. A função dele é fazer com que duas pessoas com a mesma senha tenham hashes diferentes.",
        "Sem sal, um atacante pode usar tabelas arco-íris, listas prontas com o hash de milhões de senhas comuns, e achar as senhas só consultando a tabela. Com um sal único por usuário, essas tabelas não servem, e o atacante precisa atacar cada senha separadamente.",
      ],
    },
    {
      title: "Funções lentas recomendadas",
      paragraphs: [
        "Para senhas, use uma função feita para ser lenta e, de preferência, para gastar muita memória, o que atrapalha as placas de vídeo. O Argon2id e o bcrypt guardam o sal e os parâmetros dentro do próprio hash. Com o PBKDF2 e o scrypt, você precisa gerar e guardar o sal e os parâmetros por conta própria, ao lado do hash.",
        "Ajuste o custo ao seu servidor. Um bom ponto de partida é um cálculo que leve uma fração de segundo. Para o usuário, essa espera no login quase não aparece. Para quem tenta bilhões de palpites, cada palpite fica milhares de vezes mais caro do que com um hash rápido.",
      ],
      items: [
        "Argon2id: a variante recomendada do Argon2, vencedor da Password Hashing Competition em 2015. É a primeira escolha para sistemas novos.",
        "scrypt: também usa muita memória. É uma boa alternativa quando o Argon2id não está disponível.",
        "bcrypt: de 1999, é lento de propósito e tem um fator de custo ajustável. Aceita senhas de até 72 bytes.",
        "PBKDF2: padrão antigo e muito disponível. A OWASP recomenda 600.000 iterações de HMAC-SHA-256.",
      ],
    },
    {
      title: "Cuidados no dia a dia",
      paragraphs: [
        "Os parâmetros envelhecem, porque os computadores ficam mais rápidos. Guarde a função e os parâmetros junto com cada hash. Quando você aumentar o custo, atualize o hash no próximo login do usuário: nesse momento, o sistema tem a senha correta em mãos e pode calcular o hash novo.",
        "Compare os hashes em tempo constante, com a função de comparação da sua biblioteca. Uma comparação comum para na primeira diferença, e o tempo da resposta pode dar pistas a um atacante.",
        "Por fim, use a biblioteca de senhas da sua linguagem ou do seu framework, e não monte o esquema sozinho. Junto com um bom hash, ofereça login com dois fatores e limite o número de tentativas por conta.",
      ],
    },
  ],
  algorithms: ["pbkdf2", "sha-256", "md5", "sha-1"],
  related: ["sha-256-sha-1-ou-md5", "criptografia-hash-ou-codificacao"],
  publishedAt: "2026-10-31",
};
