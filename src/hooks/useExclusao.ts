import { useState } from "react";
import { tratarErroApi } from "../api/erros";
import { excluir } from "../api/recursos";

export function useExclusao(caminho: string, aoExcluir: () => void) {
    const [erro, setErro] = useState("");

    async function excluirRegistro(id: string, descricao: string) {
        if (!window.confirm(`Excluir ${descricao}?`)) {
            return;
        }

        setErro("");
        try {
            await excluir(caminho, id);
            aoExcluir();
        } catch (e) {
            setErro(tratarErroApi(e).mensagem);
        }
    }

    return { erro, excluirRegistro };
}
