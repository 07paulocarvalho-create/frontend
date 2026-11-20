import { Link } from "react-router-dom";

type Props = {
    titulo: string;
    descricao?: string;
    acao?: {
        texto: string;
        para: string;
    };
}

export function CabecalhoPagina({ titulo, descricao, acao }: Props) {
    return (
        <div className="cabecalho-pagina">
            <div>
                <h1>{titulo}</h1>
                {descricao && <p className="pagina-descricao">{descricao}</p>}
            </div>
            {acao && <Link to={acao.para} className="btn btn-primary">{acao.texto}</Link>}
        </div>
    )
}
