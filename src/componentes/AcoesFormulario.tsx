import { Link } from "react-router-dom";

type Props = {
    enviando: boolean;
    voltarPara: string;
    textoSalvar?: string;
}

export function AcoesFormulario({ enviando, voltarPara, textoSalvar = "Salvar" }: Props) {
    return (
        <div className="acoes-formulario">
            <button type="submit" className="btn btn-primary" disabled={enviando}>
                {enviando ? "Salvando..." : textoSalvar}
            </button>
            <Link to={voltarPara} className="btn btn-secundario">Cancelar</Link>
        </div>
    )
}
