const CHAVE_TOKEN = "livraria:token";

// Armazenar o token no localStorage
export function salvarToken(token: string) {
    localStorage.setItem(CHAVE_TOKEN, token);
}

export function lerToken(): string | null {
    return localStorage.getItem(CHAVE_TOKEN);
}

export function removerToken() {
    localStorage.removeItem(CHAVE_TOKEN);
}
