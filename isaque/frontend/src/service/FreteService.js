import BaseService from "./BaseService";

class FreteService extends BaseService{

    constructor() {
        super("/api/frete");
    }

    async calcular(data) {
        const response = await this.api.post(
            `${this.endPoint}/calcular`, 
            data
        );
        return response.data;
    }

    async deletarTodos() {
        const response = await this.api.delete(
            `${this.endPoint}`
        );
        return response.data;
    }

    async obterDataHora() {
        const response = await this.api.get(
            `${this.endPoint}/data-hora`
        );
        return response.data;
    }

    async obterResumo() {
        const response = await this.api.get(
            `${this.endPoint}/resumo`
        );
        return response.data;
    }

    async listarDataEntre(inicio, fim) {
        const response = await this.api.get(
            `${this.endPoint}/filtro-data`, 
            {
                params:{
                    inicio, 
                    fim
                }
            }
        );
        return response.data;
    }

    async listarPesoEntre(minimo, maximo) {
        const response = await this.api.get(
            `${this.endPoint}/filtro-peso`,
            {
                params: {
                    minimo,
                    maximo
                }
            }
        );
        return response.data;
    }

    async listarDistanciaEntre(minimo, maximo) {
        const response = await this.api.get(
            `${this.endPoint}/filtro-distancia`,
            {
                params: {
                    minimo,
                    maximo
                }
            }
        );
        return response.data;
    }
}

export default FreteService;


