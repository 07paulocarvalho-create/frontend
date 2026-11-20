export type Perfil = "admin" | "cliente";

export type Usuario = {
    id: string;
    nome: string;
    email: string;
    cpf: string;
    perfil: Perfil;
    criadoEm: string;
}

export type CadastroUsuario = {
    nome: string;
    email: string;
    senha: string;
    cpf: string;
}

export type EdicaoUsuario = Omit<CadastroUsuario, "email">;

export type LoginResposta = {
    token: string;
    usuario: Usuario;
}
