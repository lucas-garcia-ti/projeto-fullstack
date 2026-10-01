const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const caminhoBanco = path.resolve(__dirname, 'database.sqlite');

const db = new sqlite3.Database(caminhoBanco, (erro) => {
    if (erro) {
        console.error('Erro ao conectar ao banco de dados:', erro.message);
    } else {
        console.log('Banco de dados SQLite conectado com sucesso!');
    }
});

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS fornecedores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            cnpj TEXT NOT NULL UNIQUE,
            endereco TEXT NOT NULL,
            telefone TEXT NOT NULL,
            email TEXT NOT NULL,
            contatoPrincipal TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS produtos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            codigoBarras TEXT NOT NULL UNIQUE,
            descricao TEXT,
            quantidadeEstoque INTEGER NOT NULL,
            categoria TEXT NOT NULL,
            dataValidade TEXT NOT NULL,
            imagem TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS associacoes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fornecedorId INTEGER NOT NULL,
            produtoId INTEGER NOT NULL,
            FOREIGN KEY (fornecedorId) REFERENCES fornecedores(id),
            FOREIGN KEY (produtoId) REFERENCES produtos(id),
            UNIQUE (fornecedorId, produtoId)
        )
    `);
});

module.exports = db;