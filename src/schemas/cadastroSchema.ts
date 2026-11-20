import { z } from "zod";
import { emailValido } from "../utils/validacoes";
import { campoConfirmarSenha, campoCpf, campoNome, campoSenha, erroSenhasDiferentes, senhasConferem } from "./campos";

// Campos obrigatórios: nome, email, senha, CPF
export const cadastroSchema = z
    .object({
        nome: campoNome,
        email: z
            .string()
            .trim()
            .min(1, "O email é obrigatório")
            .refine(emailValido, "Email inválido"),
        cpf: campoCpf,
        senha: campoSenha,
        confirmarSenha: campoConfirmarSenha
    })
    .refine(senhasConferem, erroSenhasDiferentes);

export type CadastroForm = z.infer<typeof cadastroSchema>;
