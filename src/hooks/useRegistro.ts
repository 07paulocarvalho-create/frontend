import { useEffect, useState } from "react";
import { tratarErroApi } from "../api/erros";
import { buscar } from "../api/recursos";

type Resultado<T> = {
    id?: string;
    dados?: T;
    erro?: string;
}

export function useRegistro<T>(caminho: string, id?: string) {
    const [resultado, setResultado] = useState<Resultado<T>>({});

    useEffect(() => {
        if (!id) {
            return;
        }

        let ativo = true;

        buscar<T>(caminho, id)
            .then((dados) => ativo && setResultado({ id, dados }))
            .catch((erro) => ativo && setResultado({ id, erro: tratarErroApi(erro).mensagem }));

        return () => {
            ativo = false;
        };
    }, [caminho, id]);

    const atual = resultado.id === id ? resultado : {};

    return {
        registro: atual.dados,
        erro: atual.erro,
        carregando: Boolean(id) && resultado.id !== id
    };
}
