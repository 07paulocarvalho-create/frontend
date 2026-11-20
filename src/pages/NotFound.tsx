import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <div className="pagina-centralizada">
            <div className="auth-card">
                <h1>Página não encontrada</h1>
                <p className="auth-rodape">
                    <Link to="/">Voltar para o início</Link>
                </p>
            </div>
        </div>
    )
}
