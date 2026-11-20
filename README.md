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
| `/` | logado | Início com atalhos de acordo com o perfil |
| `/perfil` | logado | Edição de nome, CPF e senha (o email não pode ser alterado) |
| `/livros` | logado | Catálogo paginado com filtro por categoria; admin edita e exclui |
| `/livros/novo`, `/livros/:id/editar` | admin | Cadastro e edição de livro |
| `/autores`, `/autores/novo`, `/autores/:id/editar` | admin | Listagem paginada, cadastro e edição de autores |
| `/categorias`, `/categorias/nova`, `/categorias/:id/editar` | admin | Listagem paginada, cadastro e edição de categorias |
| `/pedidos` | logado | Pedidos paginados (cliente vê só os seus) |
| `/pedidos/novo` | logado | Novo pedido com um ou mais livros e total calculado |
| `/pedidos/:id` | logado | Detalhe do pedido; admin altera o status |

Em todos os CRUDs, a listagem e o formulário de cadastro/edição ficam em telas separadas.

## Organização

```
src/
  api/          axios com o token, funções genéricas de CRUD, erros da API e localStorage
  componentes/  componentes reutilizáveis (Tabela, Paginacao, Campo, CampoSelecao, CampoArea,
                AcoesFormulario, AcoesLinha, CabecalhoPagina, Alerta, ForcaSenha, Layout, rotas protegidas)
  contexts/     AuthProvider: usuário logado disponível em toda a aplicação
  hooks/        useAuth, useListagem, useRegistro, useFormulario, useExclusao, useTodos
  pages/        uma tela por arquivo; partes exclusivas de uma tela ficam em funções no mesmo arquivo
  schemas/      validações com zod
  types/        tipos compartilhados
  utils/        validações e formatação de preço e data
```

- `Tabela<T>` e `useListagem<T>` são genéricos: a mesma tabela e a mesma lógica de paginação servem para categorias, autores e pedidos.
- `useFormulario` concentra o estado do formulário, a validação com zod e a exibição dos erros da API em todos os formulários de CRUD.

- O token fica no `localStorage` e é enviado em todas as requisições. Se a API responder 401, o token é removido e a pessoa volta ao login.
- As validações de CPF, email e nível de senha seguem as mesmas regras da API.
