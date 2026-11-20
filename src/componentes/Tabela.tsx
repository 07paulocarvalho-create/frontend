import type { ReactNode } from "react";

export type Coluna<T> = {
    titulo: string;
    conteudo: (item: T) => ReactNode;
}

type Props<T> = {
    colunas: Coluna<T>[];
    itens: T[];
    chave: (item: T) => string;
    mensagemVazia: string;
}

// Componente genérico: a mesma tabela serve para categorias, autores e pedidos
export function Tabela<T>({ colunas, itens, chave, mensagemVazia }: Props<T>) {
    if (itens.length === 0) {
        return <p className="vazio">{mensagemVazia}</p>;
    }

    return (
        <div className="tabela-container">
            <table className="tabela">
                <thead>
                    <tr>
                        {colunas.map((coluna) => <th key={coluna.titulo}>{coluna.titulo}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {itens.map((item) => (
                        <tr key={chave(item)}>
                            {colunas.map((coluna) => (
                                <td key={coluna.titulo} data-titulo={coluna.titulo}>{coluna.conteudo(item)}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
