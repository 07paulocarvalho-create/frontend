import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

type AtalhoProps = {
    para: string;
    titulo: string;
    descricao: string;
}

function Atalho({ para, titulo, descricao }: AtalhoProps) {
    return (
        <Link to={para} className="atalho">
            <strong>{titulo}</strong>
            <span>{descricao}</span>
        </Link>
    )
}

export function InicioPage() {
    const { usuario } = useAuth();
    const primeiroNome = usuario?.nome.split(" ")[0];

    return (
        <section>
            <h1>Olá, {primeiroNome}!</h1>
            <p className="pagina-descricao">
                {usuario?.perfil === "admin"
                    ? "Você está na área administrativa da Livraria Entre Páginas."
                    : "Bem-vindo à Livraria Entre Páginas."}
            </p>

            <div className="atalhos">
                <Atalho para="/perfil" titulo="Meu perfil" descricao="Atualize seu nome, CPF e senha" />
            </div>
        </section>
    )
}
