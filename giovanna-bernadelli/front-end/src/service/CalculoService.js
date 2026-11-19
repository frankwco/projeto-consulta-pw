import BaseService from "./BaseService";

class CalculoService extends BaseService {

    constructor() {
        super('calculoFrete');
    }

    async mostrarData() {
        const response = await
            this.api.get(`${this.endPoint}/hora`);
        return response.data;
    }

    async mostrarSimulacoes() {
        const response = await
            this.api.get(`${this.endPoint}/quantidade`);
        return response.data;
    }

    async mostrarMedia() {
        const response = await
            this.api.get(`${this.endPoint}/media`);
        return response.data;
    }

    async mostrarUltimaSimulacao() {
        const response = await
            this.api.get(`${this.endPoint}/ultima`);
        return response.data;
    }

    async simularCalculo(data) {
        const response = await
            this.api.post(`${this.endPoint}/calcular`, data);
        return response.data;
    }

    async adicionarCalculo(data) {
        const response = await
            this.api.post(`${this.endPoint}/adicionar`, data);
        return response.data;
    }

    async listarTodos() {
        const response = await
            this.api.get(`${this.endPoint}/listarTodos`);
        return response.data;
    }

    async listarTodosPorData(data) {
        const response = await
            this.api.get(`${this.endPoint}/hora/${data}`);
        return response.data;
    }

    async filtrarPorDistancia(distancia) {
        const response = await
            this.api.get(`${this.endPoint}/listarTodos/${distancia}`);
        return response.data;
    }

    async excluirPorID(id) {
        const response = await
            this.api.delete(`${this.endPoint}/excluir/${id}`);
        return response.data;
    }

    async excluirTodos() {
        const response = await
            this.api.delete(`${this.endPoint}/deletarTodos`);
        return response.data;
    }

}
export default CalculoService;
