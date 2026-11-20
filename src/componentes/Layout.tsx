import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const LINKS = [
    { para: "/", texto: "Início" },
    { para: "/perfil", texto: "Meu perfil" }
];

export function Layout() {
    const { usuario, sair } = useAuth();
    const navigate = useNavigate();

    function onSair() {
        sair();
        navigate("/login", { replace: true });
    }

    return (
        <div className="layout">
            <header className="cabecalho">
                <NavLink to="/" className="logo">Entre Páginas</NavLink>

                <nav className="menu">
                    {LINKS.map((link) => (
                        <NavLink key={link.para} to={link.para} end>
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
