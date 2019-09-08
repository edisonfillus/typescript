import { NegociacoesView } from '../views/NegociacoesView.js';
import { MensagemView } from '../views/MensagemView.js';
import { Negociacoes } from '../models/Negociacoes.js';
import { Negociacao } from '../models/Negociacao.js';
import { domInject, throttle } from '../helpers/decorators/index.js'
import { NegociacaoParcial } from '../models/NegociacaoParcial.js';
import { NegociacaoService } from '../services/index.js';
import { imprime } from '../helpers/Utils.js';

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
    private _service = new NegociacaoService();

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    @throttle(500)
    importarDados() {

        this._service
            .obterNegociacoes(res => {
                if (res.ok) return res;
                throw new Error(res.statusText);
            })
            .then(negociacoes => {
                negociacoes.forEach(negociacao =>
                    this._negociacoes.adiciona(negociacao));
                this._negociacoesView.update(this._negociacoes);
            });
    }

    @throttle(500)
    adiciona(event: JQuery.Event) {

        event.preventDefault();

        let data = new Date((<string>this._inputData.val()).replace(/-/g, ','));


        if (!this._ehDiaUtil(data)) {

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
        // imprime no console a negociacao
        imprime(negociacao, this._negociacoes);
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