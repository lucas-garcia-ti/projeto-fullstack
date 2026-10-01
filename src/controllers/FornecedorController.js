const db = require('../database');

const cadastrarFornecedor = (req, res) => {
    const { nome, cnpj, endereco, telefone, email, contatoPrincipal } = req.body;

    if (!nome || !cnpj || !endereco || !telefone || !email || !contatoPrincipal) {
        return res.status(400).json({
            mensagem: 'Preencha todos os campos obrigatórios!'
        });
    }

    const sqlConsulta = `
        SELECT id FROM fornecedores
        WHERE cnpj = ?
    `;

    db.get(sqlConsulta, [cnpj], (erro, fornecedorExistente) => {
        if (erro) {
            return res.status(500).json({
                mensagem: 'Erro ao consultar o banco de dados!'
            });
        }

        if (fornecedorExistente) {
            return res.status(400).json({
                mensagem: 'CNPJ já cadastrado!'
            });
        }

        const sqlCadastro = `
            INSERT INTO fornecedores
            (nome, cnpj, endereco, telefone, email, contatoPrincipal)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        db.run(
            sqlCadastro,
            [nome, cnpj, endereco, telefone, email, contatoPrincipal],
            function (erro) {
                if (erro) {
                    return res.status(500).json({
                        mensagem: 'Erro ao cadastrar fornecedor!'
                    });
                }

                return res.status(201).json({
                    mensagem: 'Fornecedor cadastrado com sucesso!',
                    fornecedor: {
                        id: this.lastID,
                        nome,
                        cnpj,
                        endereco,
                        telefone,
                        email,
                        contatoPrincipal
                    }
                });
            }
        );
    });
};

const listarFornecedores = (req, res) => {
    db.all(
        'SELECT * FROM fornecedores ORDER BY nome',
        [],
        (erro, fornecedores) => {
            if (erro) {
                return res.status(500).json({
                    mensagem: 'Erro ao listar fornecedores!'
                });
            }

            return res.status(200).json(fornecedores);
        }
    );
};

module.exports = {
    cadastrarFornecedor,
    listarFornecedores
};