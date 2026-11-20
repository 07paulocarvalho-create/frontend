import type { ZodError } from "zod";

export type ErrosFormulario<T> = Partial<Record<keyof T, string>>;

// Converte os erros do zod em uma mensagem por campo (a primeira de cada um)
export function errosPorCampo<T>(erro: ZodError<T>): ErrosFormulario<T> {
    const erros: ErrosFormulario<T> = {};

    for (const issue of erro.issues) {
        const campo = issue.path[0] as keyof T;
        erros[campo] ??= issue.message;
    }

    return erros;
}
