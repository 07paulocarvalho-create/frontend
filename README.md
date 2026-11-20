# Livraria Entre Páginas - Frontend

Interface da livraria virtual feita com React + TypeScript + Vite. A proposta do projeto e o checklist da rubrica ficam no repositório `backend`.

## Como rodar

Com o backend rodando em `http://localhost:3000`:

```bash
npm install
npm run dev
```

Para usar outra URL da API, crie um `.env.local` com `VITE_API_URL=http://endereco-da-api`.

## Telas

- `/cadastro` - cadastro com nome, email, CPF, senha e confirmação de senha
- `/login` - login, para onde o usuário é redirecionado após o cadastro

## Validações

- Campos obrigatórios
- Email com formato válido
- CPF com máscara e validação dos dígitos verificadores
- Confirmação de senha
- Mensagens de erro da API exibidas no formulário e por campo
