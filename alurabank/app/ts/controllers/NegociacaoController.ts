import { NegociacoesView } from '../views/NegociacoesView.js';
import { MensagemView } from '../views/MensagemView.js';
import { Negociacoes } from '../models/Negociacoes.js';
import { Negociacao } from '../models/Negociacao.js';
import { domInject } from '../helpers/decorators/index.js'
import { NegociacaoParcial } from '../models/NegociacaoParcial.js';

export class NegociacaoController {

    @domInject('#data')
    private _inputData!: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade!: JQuery;

    @domInject('#valor')
    private _inputValor!: JQuery;
    private _negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView('#negociacoesView');
    private _mensagemView = new MensagemView('#mensagemView');

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    importarDados() {

        function isOK(res: Response) {

            if(res.ok) {
                return res;
            } else {
                throw new Error(res.statusText);
            }
        }

        fetch('http://localhost:8080/dados')
            .then(res => isOK(res))
            .then(res => res.json())
            .then((dados: NegociacaoParcial[]) => {
                dados
                    .map(dado => new Negociacao(new Date(), dado.vezes, dado.montante))
                    .forEach(negociacao => this._negociacoes.adiciona(negociacao));
                this._negociacoesView.update(this._negociacoes);
            })
            .catch(err => console.log(err.message));       
    }

    adiciona(event: JQuery.Event) {

        event.preventDefault();

        let data = new Date((<string>this._inputData.val()).replace(/-/g, ','));


        if(!this._ehDiaUtil(data)) {

            this._mensagemView.update('Somente negociações em dias úteis, por favor!');
            return 
        }


        const negociacao = new Negociacao(
            new Date((<string>this._inputData.val()).replace(/-/g, ',')), 
            parseInt(<string>this._inputQuantidade.val()),
            parseFloat(<string>this._inputValor.val())
        );

        this._negociacoes.adiciona(negociacao);

        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');
    }

    private _ehDiaUtil(data: Date) {

        return data.getDay() != DiaDaSemana.Sabado && data.getDay() != DiaDaSemana.Domingo;
    }
}

enum DiaDaSemana {
    Domingo = 0,
    Segunda,
    Terca,
    Quarta, 
    Quinta, 
    Sexta, 
    Sabado, 
}