import { Link } from "react-router-dom";

type Props = {
    editarPara?: string;
    textoEditar?: string;
    onExcluir?: () => void;
}

export function AcoesLinha({ editarPara, textoEditar = "Editar", onExcluir }: Props) {
    return (
        <div className="acoes-linha">
            {editarPara && <Link to={editarPara} className="link-acao">{textoEditar}</Link>}
            {onExcluir && (
                <button type="button" className="link-acao link-perigo" onClick={onExcluir}>
                    Excluir
                </button>
            )}
        </div>
    )
}
