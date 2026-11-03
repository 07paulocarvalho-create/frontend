import { Link } from "react-router-dom";

export function NotFoundPage() {
    return (
        <div className="auth-card">
            <h1>Página não encontrada</h1>
            <p className="auth-rodape">
                <Link to="/cadastro">Voltar para o cadastro</Link>
            </p>
        </div>
    )
}
