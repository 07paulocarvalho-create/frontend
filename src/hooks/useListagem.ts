import { useEffect, useState } from "react";
import { tratarErroApi } from "../api/erros";
import { listar } from "../api/recursos";
import type { Pagina } from "../types/livraria";

const ITENS_POR_PAGINA = 10;

type Resultado<T> = {
    chave: string;
    dados?: Pagina<T>;
    erro?: string;
}

// Paginação das listagens: hook genérico usado por todas as telas de lista
export function useListagem<T>(caminho: string, filtros: Record<string, string> = {}) {
    const [pagina, setPagina] = useState(1);
    const [versao, setVersao] = useState(0);
    const [resultado, setResultado] = useState<Resultado<T> | null>(null);

    const filtrosTexto = JSON.stringify(filtros);
    const chave = `${caminho}|${filtrosTexto}|${pagina}|${versao}`;

    useEffect(() => {
        let ativo = true;
        const parametros = { ...JSON.parse(filtrosTexto), pagina, limite: ITENS_POR_PAGINA };

        listar<T>(caminho, parametros)
            .then((dados) => ativo && setResultado({ chave, dados }))
            .catch((erro) => ativo && setResultado({ chave, erro: tratarErroApi(erro).mensagem }));

        return () => {
            ativo = false;
        };
    }, [caminho, filtrosTexto, pagina, chave]);

    return {
        itens: resultado?.dados?.itens ?? [],
        total: resultado?.dados?.total ?? 0,
        totalPaginas: resultado?.dados?.totalPaginas ?? 0,
        pagina,
        carregando: resultado?.chave !== chave,
        erro: resultado?.erro,
        irParaPagina: setPagina,
        recarregar: () => setVersao((atual) => atual + 1)
    };
}
