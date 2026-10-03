const express = require('express');
const cors = require('cors');
const db = require('./src/database');
const path = require('path');

const {
    cadastrarFornecedor,
    listarFornecedores
} = require('./src/controllers/FornecedorController');

const {
    cadastrarProduto,
    listarProdutos,
    listarProdutosEstoqueBaixo,
    listarProdutosProximosVencimento
} = require('./src/controllers/ProdutoController');

const {
    associarFornecedor,
    desassociarFornecedor
} = require('./src/controllers/AssociacaoController');

const app = express();
const PORT = process.env.PORT || 3000;
const frontendBuildPath = path.join(__dirname, 'frontend', 'dist');


// Permite receber requisições do frontend
app.use(cors());

// Permite receber dados em JSON
app.use(express.json());

// Em produção, serve o build do React no mesmo domínio da API.
app.use(express.static(frontendBuildPath));

// Fornecedores
app.post(['/fornecedores', '/api/fornecedores'], cadastrarFornecedor);
app.get(['/fornecedores', '/api/fornecedores'], listarFornecedores);

// Produtos
app.post(['/produtos', '/api/produtos'], cadastrarProduto);
app.get('/api/produtos/estoque-baixo', listarProdutosEstoqueBaixo);
app.get('/api/produtos/proximos-vencimento', listarProdutosProximosVencimento);
app.get(['/produtos', '/api/produtos'], listarProdutos);

// Associação fornecedor x produto
app.post(['/associacoes', '/api/associacoes'], associarFornecedor);

// Desassociação fornecedor x produto
app.delete(
    [
        '/associacoes/:fornecedorId/:produtoId',
        '/api/associacoes/:fornecedorId/:produtoId'
    ],
    desassociarFornecedor
);

// Mantém uma rota de saúde da API sem ocupar a rota inicial do frontend.
app.get(['/api', '/api/health'], (req, res) => {
    res.send('API do Sistema Rapier funcionando! 🚀');
});

app.use('/api', (req, res) => {
    res.status(404).json({ mensagem: 'Rota da API não encontrada!' });
});

// Permite carregar o frontend em rotas de navegação do cliente.
app.use((req, res, next) => {
    if (req.method !== 'GET') {
        return next();
    }

    res.sendFile(path.join(frontendBuildPath, 'index.html'), (erro) => {
        if (erro) {
            next(erro);
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});