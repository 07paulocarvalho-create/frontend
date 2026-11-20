type Props = {
    pagina: number;
    totalPaginas: number;
    onMudar: (pagina: number) => void;
}

export function Paginacao({ pagina, totalPaginas, onMudar }: Props) {
    if (totalPaginas <= 1) {
        return null;
    }

    return (
        <nav className="paginacao" aria-label="Paginação">
            <button type="button" className="btn btn-secundario" disabled={pagina <= 1} onClick={() => onMudar(pagina - 1)}>
                Anterior
            </button>
            <span>Página {pagina} de {totalPaginas}</span>
            <button type="button" className="btn btn-secundario" disabled={pagina >= totalPaginas} onClick={() => onMudar(pagina + 1)}>
                Próxima
            </button>
        </nav>
    )
}
