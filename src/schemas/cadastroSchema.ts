import { z } from "zod";
import { cpfValido, emailValido } from "../utils/validacoes";

// Campos obrigatórios: nome, email, senha, CPF
export const cadastroSchema = z
    .object({
        nome: z
            .string()
            .trim()
            .min(1, "O nome é obrigatório")
            .min(3, "O nome deve ter no mínimo 3 caracteres")
            .max(100, "O nome deve ter no máximo 100 caracteres"),
        email: z
            .string()
            .trim()
            .min(1, "O email é obrigatório")
            .refine(emailValido, "Email inválido"),
        cpf: z
            .string()
            .min(1, "O CPF é obrigatório")
            .refine(cpfValido, "CPF inválido"),
        senha: z
            .string()
            .min(1, "A senha é obrigatória"),
        confirmarSenha: z
            .string()
            .min(1, "Confirme a senha")
    })
    // Verificação dupla de senha
    .refine((dados) => dados.senha === dados.confirmarSenha, {
        message: "As senhas não conferem",
        path: ["confirmarSenha"]
    });

export type CadastroForm = z.infer<typeof cadastroSchema>;
