import { useEffect, useState } from "react";
import { listar } from "../api/recursos";

const LIMITE_MAXIMO = 50;

// Carrega os registros para preencher campos de seleção (autores, categorias, livros)
export function useTodos<T>(caminho: string): T[] {
    const [itens, setItens] = useState<T[]>([]);

    useEffect(() => {
        let ativo = true;

        listar<T>(caminho, { limite: LIMITE_MAXIMO })
            .then((pagina) => ativo && setItens(pagina.itens))
            .catch(() => ativo && setItens([]));

        return () => {
            ativo = false;
        };
    }, [caminho]);

    return itens;
}
