import { useState } from 'react'
import './App.css'
import {
  quantidadeEstoqueValida,
  dataValidadeValida
} from './validacaoProduto'

function App() {
  const [tela, setTela] = useState('inicio')
  const [mensagem, setMensagem] = useState('')

  const [fornecedor, setFornecedor] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    contatoPrincipal: ''
  })

  const [produto, setProduto] = useState({
    nome: '',
    codigoBarras: '',
    descricao: '',
    quantidadeEstoque: '',
    categoria: '',
    dataValidade: '',
    imagem: ''
  })

  const [fornecedores, setFornecedores] = useState([])
  const [produtos, setProdutos] = useState([])
  const [fornecedorId, setFornecedorId] = useState('')
  const [produtoId, setProdutoId] = useState('')

  const atualizarFornecedor = (evento) => {
    const { name, value } = evento.target
    setFornecedor({ ...fornecedor, [name]: value })
  }

  const atualizarProduto = (evento) => {
    const { name, value } = evento.target
    setProduto({ ...produto, [name]: value })
  }

  const cadastrarFornecedor = async (evento) => {
    evento.preventDefault()
    setMensagem('')

    try {
      const resposta = await fetch('/api/fornecedores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fornecedor)
      })

      const dados = await resposta.json()
      setMensagem(dados.mensagem)

      if (resposta.ok) {
        setFornecedor({
          nome: '',
          cnpj: '',
          endereco: '',
          telefone: '',
          email: '',
          contatoPrincipal: ''
        })
      }
    } catch {
      setMensagem('Erro ao conectar com o servidor!')
    }
  }

  const cadastrarProduto = async (evento) => {
    evento.preventDefault()
    setMensagem('')

    if (!quantidadeEstoqueValida(produto.quantidadeEstoque)) {
      setMensagem(
        'A quantidade em estoque deve ser um número inteiro maior ou igual a zero.'
      )
      return
    }

    if (!dataValidadeValida(produto.dataValidade)) {
      setMensagem(
        'A data de validade deve ser uma data válida no formato AAAA-MM-DD.'
      )
      return
    }

    try {
      const resposta = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...produto,
          quantidadeEstoque: Number(produto.quantidadeEstoque)
        })
      })

      const dados = await resposta.json()
      setMensagem(dados.mensagem)

      if (resposta.ok) {
        setProduto({
          nome: '',
          codigoBarras: '',
          descricao: '',
          quantidadeEstoque: '',
          categoria: '',
          dataValidade: '',
          imagem: ''
        })
      }
    } catch {
      setMensagem('Erro ao conectar com o servidor!')
    }
  }

  const abrirAssociacoes = async () => {
    setMensagem('')

    try {
      const [respostaFornecedores, respostaProdutos] = await Promise.all([
        fetch('/api/fornecedores'),
        fetch('/api/produtos')
      ])

      const dadosFornecedores = await respostaFornecedores.json()
      const dadosProdutos = await respostaProdutos.json()

      setFornecedores(dadosFornecedores)
      setProdutos(dadosProdutos)
      setTela('associacao')
    } catch {
      setMensagem('Erro ao carregar fornecedores e produtos!')
    }
  }

  const associarFornecedor = async () => {
    setMensagem('')

    if (!fornecedorId || !produtoId) {
      setMensagem('Selecione um fornecedor e um produto!')
      return
    }

    try {
      const resposta = await fetch('/api/associacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fornecedorId: Number(fornecedorId),
          produtoId: Number(produtoId)
        })
      })

      const dados = await resposta.json()
      setMensagem(dados.mensagem)
    } catch {
      setMensagem('Erro ao conectar com o servidor!')
    }
  }

  const desassociarFornecedor = async () => {
    setMensagem('')

    if (!fornecedorId || !produtoId) {
      setMensagem('Selecione um fornecedor e um produto!')
      return
    }

    try {
      const resposta = await fetch(
        `/api/associacoes/${fornecedorId}/${produtoId}`,
        { method: 'DELETE' }
      )

      const dados = await resposta.json()
      setMensagem(dados.mensagem)
    } catch {
      setMensagem('Erro ao conectar com o servidor!')
    }
  }

  const voltarInicio = () => {
    setTela('inicio')
    setMensagem('')
  }

  return (
    <div className="container">
      <header>
        <h1>Sistema de Controle de Estoque</h1>
        <p>Gerenciamento de produtos e fornecedores</p>
      </header>

      {tela === 'inicio' && (
        <main>
          <section className="card">
            <h2>Fornecedor</h2>
            <p>Cadastre e gerencie os fornecedores do sistema.</p>
            <button onClick={() => setTela('fornecedor')}>
              Cadastrar Fornecedor
            </button>
          </section>

          <section className="card">
            <h2>Produto</h2>
            <p>Cadastre os produtos e controle as informações do estoque.</p>
            <button onClick={() => setTela('produto')}>
              Cadastrar Produto
            </button>
          </section>

          <section className="card">
            <h2>Fornecedor x Produto</h2>
            <p>Associe ou desassocie fornecedores aos produtos cadastrados.</p>
            <button onClick={abrirAssociacoes}>
              Gerenciar Associações
            </button>
          </section>
        </main>
      )}

      {tela === 'fornecedor' && (
        <main className="form-container">
          <section className="card formulario">
            <h2>Cadastro de Fornecedor</h2>

            <form onSubmit={cadastrarFornecedor}>
              <label>Nome / Empresa</label>
              <input name="nome" value={fornecedor.nome}
                onChange={atualizarFornecedor} />

              <label>CNPJ</label>
              <input name="cnpj" value={fornecedor.cnpj}
                onChange={atualizarFornecedor} />

              <label>Endereço</label>
              <input name="endereco" value={fornecedor.endereco}
                onChange={atualizarFornecedor} />

              <label>Telefone</label>
              <input name="telefone" value={fornecedor.telefone}
                onChange={atualizarFornecedor} />

              <label>E-mail</label>
              <input type="email" name="email" value={fornecedor.email}
                onChange={atualizarFornecedor} />

              <label>Contato Principal</label>
              <input name="contatoPrincipal"
                value={fornecedor.contatoPrincipal}
                onChange={atualizarFornecedor} />

              <button type="submit">Cadastrar Fornecedor</button>
            </form>

            {mensagem && <p className="mensagem">{mensagem}</p>}
            <button className="voltar" onClick={voltarInicio}>Voltar</button>
          </section>
        </main>
      )}

      {tela === 'produto' && (
        <main className="form-container">
          <section className="card formulario">
            <h2>Cadastro de Produto</h2>

            <form onSubmit={cadastrarProduto}>
              <label>Nome do Produto</label>
              <input name="nome" value={produto.nome}
                onChange={atualizarProduto} />

              <label>Código de Barras</label>
              <input name="codigoBarras" value={produto.codigoBarras}
                onChange={atualizarProduto} />

              <label>Descrição</label>
              <input name="descricao" value={produto.descricao}
                onChange={atualizarProduto} />

              <label>Quantidade em Estoque</label>
              <input type="number" name="quantidadeEstoque"
                min="0" step="1" required
                onInvalid={(evento) => {
                  evento.preventDefault()
                  setMensagem(
                    'A quantidade em estoque deve ser um número inteiro maior ou igual a zero.'
                  )
                }}
                value={produto.quantidadeEstoque}
                onChange={atualizarProduto} />

              <label>Categoria</label>
              <input name="categoria" value={produto.categoria}
                onChange={atualizarProduto} />

              <label>Data de Validade</label>
              <input type="date" name="dataValidade"
                required
                onInvalid={(evento) => {
                  evento.preventDefault()
                  setMensagem(
                    'A data de validade deve ser uma data válida no formato AAAA-MM-DD.'
                  )
                }}
                value={produto.dataValidade}
                onChange={atualizarProduto} />

              <label>Imagem</label>
              <input name="imagem" value={produto.imagem}
                onChange={atualizarProduto} />

              <button type="submit">Cadastrar Produto</button>
            </form>

            {mensagem && <p className="mensagem">{mensagem}</p>}
            <button className="voltar" onClick={voltarInicio}>Voltar</button>
          </section>
        </main>
      )}

      {tela === 'associacao' && (
        <main className="form-container">
          <section className="card formulario">
            <h2>Fornecedor x Produto</h2>

            <label>Fornecedor</label>
            <select
              value={fornecedorId}
              onChange={(e) => setFornecedorId(e.target.value)}
            >
              <option value="">Selecione um fornecedor</option>
              {fornecedores.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>

            <label>Produto</label>
            <select
              value={produtoId}
              onChange={(e) => setProdutoId(e.target.value)}
            >
              <option value="">Selecione um produto</option>
              {produtos.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nome}
                </option>
              ))}
            </select>

            <button className="botao-associar" onClick={associarFornecedor}>
              Associar Fornecedor
            </button>

            <button className="botao-desassociar" onClick={desassociarFornecedor}>
              Desassociar Fornecedor
            </button>

            {mensagem && <p className="mensagem">{mensagem}</p>}

            <button className="voltar" onClick={voltarInicio}>
              Voltar
            </button>
          </section>
        </main>
      )}
    </div>
  )
}

export default App