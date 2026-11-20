import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LINKS = [
    { para: "/", texto: "Início", somenteAdmin: false },
    { para: "/livros", texto: "Livros", somenteAdmin: false },
    { para: "/autores", texto: "Autores", somenteAdmin: true },
    { para: "/categorias", texto: "Categorias", somenteAdmin: true },
    { para: "/pedidos", texto: "Pedidos", somenteAdmin: false },
    { para: "/perfil", texto: "Meu perfil", somenteAdmin: false }
];

export function Layout() {
    const { usuario, sair } = useAuth();
    const navigate = useNavigate();
    const links = LINKS.filter((link) => !link.somenteAdmin || usuario?.perfil === "admin");

    function onSair() {
        sair();
        navigate("/login", { replace: true });
    }

    return (
        <div className="layout">
            <header className="cabecalho">
                <NavLink to="/" className="logo">Entre Páginas</NavLink>

                <nav className="menu">
                    {links.map((link) => (
                        <NavLink key={link.para} to={link.para} end={link.para === "/"}>
                            {link.texto}
                        </NavLink>
                    ))}
                </nav>

                <div className="usuario-logado">
                    <span>{usuario?.nome}</span>
                    <button type="button" className="btn btn-secundario" onClick={onSair}>Sair</button>
                </div>
            </header>

            <main className="conteudo">
                <Outlet />
            </main>
        </div>
    )
}
