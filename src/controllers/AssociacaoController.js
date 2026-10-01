const db = require('../database');

// Associar fornecedor a um produto
const associarFornecedor = (req, res) => {
    const { fornecedorId, produtoId } = req.body;

    if (!fornecedorId || !produtoId) {
        return res.status(400).json({
            mensagem: 'Fornecedor e produto são obrigatórios!'
        });
    }

    db.get(
        'SELECT id FROM fornecedores WHERE id = ?',
        [fornecedorId],
        (erro, fornecedor) => {
            if (erro) {
                return res.status(500).json({
                    mensagem: 'Erro ao consultar o banco de dados!'
                });
            }

            if (!fornecedor) {
                return res.status(404).json({
                    mensagem: 'Fornecedor ou produto não encontrado!'
                });
            }

            db.get(
                'SELECT id FROM produtos WHERE id = ?',
                [produtoId],
                (erro, produto) => {
                    if (erro) {
                        return res.status(500).json({
                            mensagem: 'Erro ao consultar o banco de dados!'
                        });
                    }

                    if (!produto) {
                        return res.status(404).json({
                            mensagem: 'Fornecedor ou produto não encontrado!'
                        });
                    }

                    db.get(
                        `SELECT id FROM associacoes
                         WHERE fornecedorId = ? AND produtoId = ?`,
                        [fornecedorId, produtoId],
                        (erro, associacaoExistente) => {
                            if (erro) {
                                return res.status(500).json({
                                    mensagem: 'Erro ao consultar associação!'
                                });
                            }

                            if (associacaoExistente) {
                                return res.status(400).json({
                                    mensagem: 'Fornecedor já está associado a este produto!'
                                });
                            }

                            db.run(
                                `INSERT INTO associacoes
                                 (fornecedorId, produtoId)
                                 VALUES (?, ?)`,
                                [fornecedorId, produtoId],
                                function (erro) {
                                    if (erro) {
                                        return res.status(500).json({
                                            mensagem: 'Erro ao realizar associação!'
                                        });
                                    }

                                    return res.status(201).json({
                                        mensagem: 'Fornecedor associado ao produto com sucesso!',
                                        associacao: {
                                            id: this.lastID,
                                            fornecedorId: Number(fornecedorId),
                                            produtoId: Number(produtoId)
                                        }
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};

// Desassociar fornecedor de um produto
const desassociarFornecedor = (req, res) => {
    const fornecedorId = Number(req.params.fornecedorId);
    const produtoId = Number(req.params.produtoId);

    db.run(
        `DELETE FROM associacoes
         WHERE fornecedorId = ? AND produtoId = ?`,
        [fornecedorId, produtoId],
        function (erro) {
            if (erro) {
                return res.status(500).json({
                    mensagem: 'Erro ao desassociar fornecedor!'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    mensagem: 'Associação não encontrada!'
                });
            }

            return res.status(200).json({
                mensagem: 'Fornecedor desassociado do produto com sucesso!'
            });
        }
    );
};

module.exports = {
    associarFornecedor,
    desassociarFornecedor
};