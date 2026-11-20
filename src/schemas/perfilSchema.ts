import { z } from "zod";
import { campoConfirmarSenha, campoCpf, campoNome, campoSenha, erroSenhasDiferentes, senhasConferem } from "./campos";

// Edição de Usuário: o email não faz parte do formulário e não pode ser alterado
export const perfilSchema = z
    .object({
        nome: campoNome,
        cpf: campoCpf,
        senha: campoSenha,
        confirmarSenha: campoConfirmarSenha
    })
    .refine(senhasConferem, erroSenhasDiferentes);

export type PerfilForm = z.infer<typeof perfilSchema>;
