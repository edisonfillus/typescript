import { NegociacaoController } from './controllers/NegociacaoController.js';

const controller = new NegociacaoController();
$('.form').submit(controller.adiciona.bind(controller));
$('#botao-importa').click(controller.importarDados.bind(controller));