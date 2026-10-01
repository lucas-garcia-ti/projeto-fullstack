const express = require('express');
const cors = require('cors');
const db = require('./src/database');

const {
    cadastrarFornecedor,
    listarFornecedores
} = require('./src/controllers/FornecedorController');

const {
    cadastrarProduto,
    listarProdutos
} = require('./src/controllers/ProdutoController');

const {
    associarFornecedor,
    desassociarFornecedor
} = require('./src/controllers/AssociacaoController');

const app = express();
const PORT = 3000;


// Permite receber requisições do frontend
app.use(cors());

// Permite receber dados em JSON
app.use(express.json());

// Rota inicial
app.get('/', (req, res) => {
    res.send('API do Sistema de Estoque funcionando! 🚀');
});

// Fornecedores
app.post('/fornecedores', cadastrarFornecedor);
app.get('/fornecedores', listarFornecedores);

// Produtos
app.post('/produtos', cadastrarProduto);
app.get('/produtos', listarProdutos);

// Associação fornecedor x produto
app.post('/associacoes', associarFornecedor);

// Desassociação fornecedor x produto
app.delete(
    '/associacoes/:fornecedorId/:produtoId',
    desassociarFornecedor
);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});