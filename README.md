# Livraria Entre Páginas - Frontend

Interface da livraria virtual feita com React + TypeScript + Vite. A proposta do projeto e o checklist da rubrica ficam no repositório `backend`.

## Como rodar

### Com Docker (recomendado)

O `docker-compose.yml` do repositório `backend` compila este projeto e o serve pelo Nginx. Com os dois repositórios lado a lado, rode dentro de `backend`:

```bash
docker compose up -d --build
```

Acesse `http://localhost:8080`.

### Em desenvolvimento

Com a API rodando em `http://localhost:3000`:

```bash
npm install
npm run dev
```

Para usar outra URL da API, crie um `.env.local` com `VITE_API_URL=http://endereco-da-api`.

## Telas

| Rota | Acesso | Descrição |
|---|---|---|
| `/cadastro` | público | Cadastro com nome, email, CPF, senha e confirmação |
| `/login` | público | Login; leva para a área logada |
| `/` | logado | Início da área logada |
| `/perfil` | logado | Edição de nome, CPF e senha (o email não pode ser alterado) |

## Organização

```
src/
  api/          axios com o token, leitura de erros da API e localStorage
  componentes/  componentes reutilizáveis (Campo, Alerta, ForcaSenha, Layout, RotaPrivada)
  contexts/     AuthProvider: usuário logado disponível em toda a aplicação
  hooks/        useAuth
  pages/        uma tela por arquivo
  schemas/      validações com zod
  types/        tipos compartilhados
  utils/        validação de CPF, email e senha
```

- O token fica no `localStorage` e é enviado em todas as requisições. Se a API responder 401, o token é removido e a pessoa volta ao login.
- As validações de CPF, email e nível de senha seguem as mesmas regras da API.
