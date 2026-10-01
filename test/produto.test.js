const assert = require('node:assert/strict');
const test = require('node:test');
const {
    cadastrarProduto
} = require('../src/controllers/ProdutoController');
const {
    quantidadeEstoqueValida,
    dataValidadeValida
} = require('../src/validacaoProduto');
const validadoresFrontend = import('../frontend/src/validacaoProduto.js');

const produtoObrigatorio = {
    nome: 'Produto de teste',
    codigoBarras: 'teste',
    descricao: '',
    quantidadeEstoque: 1,
    categoria: 'Teste',
    dataValidade: '2028-02-29'
};

const respostaSimulada = () => {
    const resposta = {
        statusCode: 200,
        corpo: null,
        status(codigo) {
            this.statusCode = codigo;
            return this;
        },
        json(corpo) {
            this.corpo = corpo;
            return this;
        }
    };

    return resposta;
};

test('aceita quantidades em estoque inteiras e não negativas', () => {
    assert.equal(quantidadeEstoqueValida(0), true);
    assert.equal(quantidadeEstoqueValida(1), true);
});

test('rejeita quantidade negativa, fracionária e não numérica', () => {
    for (const quantidade of [-1, 1.5, 'abc']) {
        assert.equal(quantidadeEstoqueValida(quantidade), false);
    }
});

test('validação do formulário aceita zero e um e rejeita valores inválidos', async () => {
    const { quantidadeEstoqueValida: quantidadeFrontendValida } =
        await validadoresFrontend;

    assert.equal(quantidadeFrontendValida('0'), true);
    assert.equal(quantidadeFrontendValida('1'), true);

    for (const quantidade of ['-1', '1.5', 'abc', '']) {
        assert.equal(quantidadeFrontendValida(quantidade), false);
    }
});

test('aceita datas reais no formato AAAA-MM-DD', () => {
    assert.equal(dataValidadeValida('2028-02-29'), true);
    assert.equal(dataValidadeValida('2026-02-28'), true);
});

test('rejeita datas inexistentes e formatos diferentes de AAAA-MM-DD', () => {
    for (const data of [
        '2026-02-30',
        '2026-02-29',
        '28/02/2026',
        '2026-2-28',
        '2026-13-01'
    ]) {
        assert.equal(dataValidadeValida(data), false, data);
    }
});

test('validação do formulário aceita data real e rejeita datas inválidas', async () => {
    const { dataValidadeValida: dataFrontendValida } =
        await validadoresFrontend;

    assert.equal(dataFrontendValida('2028-02-29'), true);
    assert.equal(dataFrontendValida('2026-02-28'), true);

    for (const data of ['2026-02-30', '2026-02-29', '28/02/2026']) {
        assert.equal(dataFrontendValida(data), false);
    }
});

test('controlador responde HTTP 400 e mensagem clara para quantidades inválidas', () => {
    for (const quantidade of [-1, 1.5, 'abc']) {
        const resposta = respostaSimulada();

        cadastrarProduto(
            { body: { ...produtoObrigatorio, quantidadeEstoque: quantidade } },
            resposta
        );

        assert.equal(resposta.statusCode, 400);
        assert.match(resposta.corpo.mensagem, /número inteiro maior ou igual a zero/);
    }
});

test('controlador responde HTTP 400 para data inexistente e formato inválido', () => {
    for (const dataValidade of ['2026-02-30', '30/02/2026']) {
        const resposta = respostaSimulada();

        cadastrarProduto(
            { body: { ...produtoObrigatorio, dataValidade } },
            resposta
        );

        assert.equal(resposta.statusCode, 400);
        assert.match(resposta.corpo.mensagem, /formato AAAA-MM-DD/);
    }
});