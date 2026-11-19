import BaseService from "./BaseService";

class AtividadeService extends BaseService{
    constructor(){
        super('/atividade');
    }

    async calcular(dados){
        const response = await  this.api.post(`${this.endPoint}/calcular`, dados);
        return response.data;
    }

    async data(){
        const response = await this.api.get(`${this.endPoint}/dataHora`);
        return response.data;
    }

    async limparTabela(){
        const response = await this.api.delete(`${this.endPoint}/limpar`);
        return response.data;
    }

    async filtrarPorClassificacao(classificacao){
        const response = await this.api.get(`${this.endPoint}/classificacao/{classificacao}`);
        return response.data;
    }

}

export default AtividadeService;