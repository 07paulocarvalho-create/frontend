import { z } from "zod";
import { avaliarSenha, cpfValido } from "../utils/validacoes";

export const campoNome = z
    .string()
    .trim()
    .min(1, "O nome é obrigatório")
    .min(3, "O nome deve ter no mínimo 3 caracteres")
    .max(100, "O nome deve ter no máximo 100 caracteres");

// Validação de CPF
export const campoCpf = z
    .string()
    .min(1, "O CPF é obrigatório")
    .refine(cpfValido, "CPF inválido");

// Validação de nível de senha
export const campoSenha = z
    .string()
    .min(1, "A senha é obrigatória")
    .refine((senha) => avaliarSenha(senha).nivel === "forte", "A senha precisa ser forte");

export const campoConfirmarSenha = z
    .string()
    .min(1, "Confirme a senha");

// Verificação dupla de senha
export function senhasConferem(dados: { senha: string; confirmarSenha: string }) {
    return dados.senha === dados.confirmarSenha;
}

export const erroSenhasDiferentes = {
    message: "As senhas não conferem",
    path: ["confirmarSenha"]
};
