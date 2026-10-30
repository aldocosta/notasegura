# PRD — SafeNote POC (clone do safenote.co)

## Visão geral

Ferramenta web para compartilhar texto de forma segura e não perene. O usuário cria um texto, opcionalmente o protege com uma chave (passphrase) que faz parte da criptografia, define expiração (tempo e/ou número de visualizações) e gera um link. Quem recebe o link pode abrir o texto uma vez (ou N vezes) dentro do prazo; após isso o link deixa de funcionar.

Sem login. Acesso anônimo. Backend NestJS (clean architecture + design patterns) sobre MongoDB. Frontend Next.js + Tailwind CSS, responsivo e user-friendly, seguindo o design de referência em `/home/aldo/Downloads/DESIGN-nerdwallet.md`.

## Público-alvo

Pessoas que precisam compartilhar texto (senhas, tokens, notas) de forma segura e temporária, sem depender de e-mail/messengers persistentes.

## Requisitos funcionais

1. **Criar nota**: textarea para o texto; opção de passphrase (opcional, parte da criptografia).
2. **Configurar expiração**:
   - Tempo: mínimo 1 dia, máximo 30 dias.
   - Visualizações: mínimo 1, máximo 50.
3. **Gerar link**: ao submeter, o backend criptografa e persiste; retorna URL única.
4. **Abrir link**: quem tem o link vê o texto (se houver passphrase, é solicitada para descriptografar); cada abertura consome 1 visualização.
5. **Expiração automática**: após o prazo ou após esgotar visualizações, o link retorna "não encontrado/expirado".
6. **Sem autenticação**: nenhuma conta/usuário.

## Regras de negócio

- Passphrase é opcional; quando fornecida, integra a chave de criptografia (não armazenada em claro).
- Mín/máx de dias: 1–30. Mín/máx de views: 1–50.
- Conteúdo é apagado/expirado após limites; não há recuperação.
- Links são únicos e não adivinháveis (UUID/token aleatório).

## Arquitetura (backend — NestJS)

- Clean Architecture: camadas domain (entidades/use cases), application (interfaces/gateways), infrastructure (MongoDB, crypto), presentation (controllers/DTOs).
- Design patterns: Repository, Factory, Strategy (crypto), Builder (link).
- Módulos: NotesModule, CryptoModule, ExpirationModule.
- MongoDB com TTL index para expiração por tempo; contador de views para expiração por uso.

## Frontend (Next.js + Tailwind)

- Páginas: `/` (criar nota), `/n/[id]` (visualizar).
- Componentes: formulário de criação, seletor de expiração, exibição do link gerado, tela de abertura com prompt de passphrase, estados de erro/expirado.
- Responsivo, user-friendly, seguindo paleta/shape do design de referência (verde profundo + mints, botões quadrados, hairlines).

## Stack

- Frontend: Next.js (App Router), TypeScript, Tailwind CSS.
- Backend: NestJS, TypeScript, MongoDB (Mongoose), crypto (AES-256-GCM ou libsodium).
- Deploy: a definir.

## Métricas de sucesso da POC

- Criar e abrir nota com/sem passphrase.
- Expiração por tempo e por views funcionando.
- UI responsiva em mobile/tablet/desktop.

## Fora de escopo (POC)

- Login/contas, analytics, anexos, rate limiting avançado, auditoria.
" > /home/aldo/Documents/Projects/Maestri/notasegura/docs/poc.md && echo ok