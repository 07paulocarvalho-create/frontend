export function somenteNumeros(valor: string): string {
    return valor.replace(/\D/g, "");
}

export function formatarCpf(valor: string): string {
    const numeros = somenteNumeros(valor).slice(0, 11);

    return numeros
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d)/, "$1.$2")
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function calcularDigito(base: string, pesoInicial: number): number {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
        soma += Number(base[i]) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
}

// Validação de CPF
export function cpfValido(valor: string): boolean {
    const cpf = somenteNumeros(valor);

    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }

    return calcularDigito(cpf.slice(0, 9), 10) === Number(cpf[9])
        && calcularDigito(cpf.slice(0, 10), 11) === Number(cpf[10]);
}

export type NivelSenha = "fraca" | "media" | "forte";

const CRITERIOS_SENHA = [
    { regra: (s: string) => s.length >= 8, descricao: "8 caracteres" },
    { regra: (s: string) => /[a-z]/.test(s), descricao: "letra minúscula" },
    { regra: (s: string) => /[A-Z]/.test(s), descricao: "letra maiúscula" },
    { regra: (s: string) => /\d/.test(s), descricao: "número" },
    { regra: (s: string) => /[^A-Za-z0-9]/.test(s), descricao: "caractere especial" },
];

// Validação de nível de senha (mesmas regras da API)
export function avaliarSenha(senha: string): { nivel: NivelSenha; pendencias: string[] } {
    const pendencias = CRITERIOS_SENHA.filter((c) => !c.regra(senha)).map((c) => c.descricao);
    const atendidos = CRITERIOS_SENHA.length - pendencias.length;

    let nivel: NivelSenha = "fraca";
    if (atendidos === CRITERIOS_SENHA.length) {
        nivel = "forte";
    } else if (atendidos >= 3) {
        nivel = "media";
    }

    return { nivel, pendencias };
}

const FORMATO_EMAIL = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*\.[a-z]{2,}$/;

// Validação de email
export function emailValido(valor: string): boolean {
    const email = valor.trim().toLowerCase();
    return email.length <= 254 && FORMATO_EMAIL.test(email) && !email.includes("..");
}
