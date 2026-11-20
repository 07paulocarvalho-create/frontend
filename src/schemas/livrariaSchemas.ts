import { z } from "zod";

const obrigatorio = "Campo obrigatório";

function paraNumero(valor: string): number {
    return Number(valor.trim().replace(",", "."));
}

// Validação dos campos obrigatórios dos CRUDs

export const categoriaSchema = z.object({
    nome: z.string().trim().min(1, obrigatorio).max(60, "Máximo de 60 caracteres"),
    descricao: z.string().trim().max(255, "Máximo de 255 caracteres")
});

export const autorSchema = z.object({
    nome: z.string().trim().min(1, obrigatorio).max(100, "Máximo de 100 caracteres"),
    biografia: z.string().trim().max(1000, "Máximo de 1000 caracteres")
});

export const livroSchema = z.object({
    titulo: z.string().trim().min(1, obrigatorio).max(150, "Máximo de 150 caracteres"),
    descricao: z.string().trim().max(2000, "Máximo de 2000 caracteres"),
    preco: z
        .string()
        .trim()
        .min(1, obrigatorio)
        .refine((valor) => !Number.isNaN(paraNumero(valor)), "Informe um número")
        .refine((valor) => paraNumero(valor) >= 0, "O preço não pode ser negativo")
        .transform(paraNumero),
    estoque: z
        .string()
        .trim()
        .min(1, obrigatorio)
        .refine((valor) => Number.isInteger(paraNumero(valor)) && paraNumero(valor) >= 0, "Informe um número inteiro maior ou igual a zero")
        .transform(paraNumero),
    isbn: z
        .string()
        .trim()
        .min(1, obrigatorio)
        .refine((valor) => /^(\d{9}[\dXx]|\d{13})$/.test(valor.replace(/[\s-]/g, "")), "O ISBN deve ter 10 ou 13 dígitos"),
    capaUrl: z
        .string()
        .trim()
        .refine((valor) => !valor || /^https?:\/\/\S+$/.test(valor), "Informe uma URL começando com http:// ou https://"),
    autorId: z.string().min(1, "Selecione o autor"),
    categoriaId: z.string().min(1, "Selecione a categoria")
});

export type CategoriaForm = z.input<typeof categoriaSchema>;
export type AutorForm = z.input<typeof autorSchema>;
export type LivroForm = z.input<typeof livroSchema>;
