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

const ATALHOS_CLIENTE: AtalhoProps[] = [
    { para: "/livros", titulo: "Catálogo", descricao: "Veja os livros disponíveis" },
    { para: "/pedidos/novo", titulo: "Novo pedido", descricao: "Escolha seus livros" },
    { para: "/pedidos", titulo: "Meus pedidos", descricao: "Acompanhe o status das compras" },
    { para: "/perfil", titulo: "Meu perfil", descricao: "Atualize seu nome, CPF e senha" }
];

const ATALHOS_ADMIN: AtalhoProps[] = [
    { para: "/livros", titulo: "Livros", descricao: "Cadastre livros, preços e estoque" },
    { para: "/autores", titulo: "Autores", descricao: "Gerencie os autores" },
    { para: "/categorias", titulo: "Categorias", descricao: "Organize o catálogo" },
    { para: "/pedidos", titulo: "Pedidos", descricao: "Acompanhe e atualize o status" }
];

export function InicioPage() {
    const { usuario } = useAuth();
    const admin = usuario?.perfil === "admin";
    const primeiroNome = usuario?.nome.split(" ")[0];

    return (
        <section>
            <h1>Olá, {primeiroNome}!</h1>
            <p className="pagina-descricao">
                {admin
                    ? "Você está na área administrativa da Livraria Entre Páginas."
                    : "Bem-vindo à Livraria Entre Páginas."}
            </p>

            <div className="atalhos">
                {(admin ? ATALHOS_ADMIN : ATALHOS_CLIENTE).map((atalho) => <Atalho key={atalho.para} {...atalho} />)}
            </div>
        </section>
    )
}
