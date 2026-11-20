import { useState, type ChangeEvent } from "react";
import type { ZodType } from "zod";
import { tratarErroApi } from "../api/erros";
import { errosPorCampo, type ErrosFormulario } from "../utils/formulario";

type EventoCampo = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;

export function useFormulario<F extends Record<string, string>>(inicial: F) {
    const [form, setForm] = useState<F>(inicial);
    const [erros, setErros] = useState<ErrosFormulario<F>>({});
    const [mensagemErro, setMensagemErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    function onChange(event: EventoCampo) {
        const campo = event.target.name as keyof F;
        setForm((atual) => ({ ...atual, [campo]: event.target.value }));
        setErros((atual) => ({ ...atual, [campo]: undefined }));
    }

    // Validação dos campos obrigatórios antes de enviar
    function validar<S>(schema: ZodType<S>): S | null {
        setMensagemErro("");
        const resultado = schema.safeParse(form);

        if (!resultado.success) {
            setErros(errosPorCampo(resultado.error) as ErrosFormulario<F>);
            return null;
        }

        setErros({});
        return resultado.data;
    }

    function mostrarErroApi(erro: unknown) {
        const { mensagem, erros: errosApi } = tratarErroApi(erro);
        setMensagemErro(mensagem);
        setErros(errosApi as ErrosFormulario<F>);
    }

    async function enviar<S>(schema: ZodType<S>, acao: (dados: S) => Promise<void>) {
        const dados = validar(schema);
        if (!dados) {
            return;
        }

        setEnviando(true);
        try {
            await acao(dados);
        } catch (erro) {
            mostrarErroApi(erro);
        } finally {
            setEnviando(false);
        }
    }

    return { form, erros, mensagemErro, enviando, onChange, validar, mostrarErroApi, enviar };
}
