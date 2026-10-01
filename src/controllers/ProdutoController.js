const db = require('../database');
const {
    quantidadeEstoqueValida,
    dataValidadeValida
} = require('../validacaoProduto');

const cadastrarProduto = (req, res) => {
    const {
        nome,
        codigoBarras,
        descricao,
        quantidadeEstoque,
        categoria,
        dataValidade,
        imagem
    } = req.body;

    if (
        !nome ||
        !codigoBarras ||
        descricao === undefined ||
        quantidadeEstoque === undefined ||
        !categoria ||
        !dataValidade
    ) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos obrigatórios!'
        });
    }

    if (!quantidadeEstoqueValida(quantidadeEstoque)) {
        return res.status(400).json({
            mensagem: 'A quantidade em estoque deve ser um número inteiro maior ou igual a zero.'
        });
    }

    if (!dataValidadeValida(dataValidade)) {
        return res.status(400).json({
            mensagem: 'A data de validade deve ser uma data válida no formato AAAA-MM-DD.'
        });
    }

    const sqlConsulta = `
        SELECT id FROM produtos
        WHERE codigoBarras = ?
    `;

    db.get(sqlConsulta, [codigoBarras], (erro, produtoExistente) => {
        if (erro) {
            return res.status(500).json({
                mensagem: 'Erro ao consultar o banco de dados!'
            });
        }

        if (produtoExistente) {
            return res.status(400).json({
                mensagem: 'Código de barras já cadastrado!'
            });
        }

        const sqlCadastro = `
            INSERT INTO produtos
            (nome, codigoBarras, descricao, quantidadeEstoque, categoria, dataValidade, imagem)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.run(
            sqlCadastro,
            [
                nome,
                codigoBarras,
                descricao,
                quantidadeEstoque,
                categoria,
                dataValidade,
                imagem || null
            ],
            function (erro) {
                if (erro) {
                    return res.status(500).json({
                        mensagem: 'Erro ao cadastrar produto!'
                    });
                }

                return res.status(201).json({
                    mensagem: 'Produto cadastrado com sucesso!',
                    produto: {
                        id: this.lastID,
                        nome,
                        codigoBarras,
                        descricao,
                        quantidadeEstoque,
                        categoria,
                        dataValidade,
                        imagem: imagem || null
                    }
                });
            }
        );
    });
};

const listarProdutos = (req, res) => {
    db.all(
        'SELECT * FROM produtos ORDER BY nome',
        [],
        (erro, produtos) => {
            if (erro) {
                return res.status(500).json({
                    mensagem: 'Erro ao listar produtos!'
                });
            }

            return res.status(200).json(produtos);
        }
    );
};

module.exports = {
    cadastrarProduto,
    listarProdutos
};