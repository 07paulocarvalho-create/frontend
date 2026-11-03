import axios from "axios";

export type ErroApi = {
    mensagem: string;
    erros: Record<string, string>;
}

// Lidar com as mensagens de erro da API
export function tratarErroApi(erro: unknown): ErroApi {
    if (axios.isAxiosError(erro)) {
        if (!erro.response) {
            return {
                mensagem: "Não foi possível conectar ao servidor. Tente novamente em instantes.",
                erros: {}
            };
        }

        const corpo = erro.response.data as Partial<ErroApi> | undefined;

        return {
            mensagem: corpo?.mensagem ?? "Erro ao processar a requisição",
            erros: corpo?.erros ?? {}
        };
    }

    return { mensagem: "Erro inesperado", erros: {} };
}
