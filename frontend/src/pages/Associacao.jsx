import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';

export default function Associacao() {
  const nav = useNavigate();

  const [query, setQuery] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  const [selectedProduto, setSelectedProduto] = useState(null);
  const [selectedFornecedorId, setSelectedFornecedorId] = useState('');

  const [fornecedorFilter, setFornecedorFilter] = useState('');
  const [message, setMessage] = useState(null);

  const [loadingSearch, setLoadingSearch] = useState(false);
  const [loadingAssoc, setLoadingAssoc] = useState(false);

  /* ===============================
     BUSCA PRODUTOS
  =============================== */
  async function search() {
    setLoadingSearch(true);
    setMessage(null);

    try {
      const res = await api.get('/produtos', {
        params: { q: query },
      });

      setProdutos(res.data || []);
    } catch {
      setMessage('Não foi possível buscar produtos.');
    } finally {
      setLoadingSearch(false);
    }
  }

  /* ===============================
     CARREGA FORNECEDORES
  =============================== */
  async function loadFornecedores() {
    try {
      const res = await api.get('/fornecedores', {
        params: { q: '' },
      });

      setFornecedores(res.data || []);
    } catch {
      setFornecedores([]);
      setMessage('Erro ao carregar fornecedores.');
    }
  }

  useEffect(() => {
    search();
    loadFornecedores();
  }, []);

  /* ===============================
     FILTRO LOCAL
  =============================== */
  const fornecedoresFiltrados = useMemo(() => {
    const q = fornecedorFilter.trim().toLowerCase();

    if (!q) return fornecedores;

    return fornecedores.filter((f) =>
      (f.nome || '').toLowerCase().includes(q) ||
      (f.cnpj || '').includes(q)
    );
  }, [fornecedores, fornecedorFilter]);

  /* ===============================
     ASSOCIAR
  =============================== */
  async function handleAssociar() {
    if (!selectedProduto || !selectedFornecedorId) return;

    setLoadingAssoc(true);
    setMessage(null);

    try {
      const res = await api.post('/associacoes', {
        produto_id: selectedProduto.id,
        fornecedor_id: Number(selectedFornecedorId),
      });

      setMessage(res.data?.message || 'Associação realizada com sucesso.');
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage('Este produto já está associado a outro fornecedor.');
      } else {
        setMessage('Erro ao realizar associação.');
      }
    } finally {
      setLoadingAssoc(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>

      {/* ================= HEADER ================= */}
      <header
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          marginBottom: 32,
        }}
      >
        <div />

        <h2 style={{ margin: 0, textAlign: 'center' }}>
          Associação Fornecedor-Produto
        </h2>

        <div style={{ textAlign: 'right' }}>
          <button onClick={() => nav('/')}>Voltar</button>
        </div>
      </header>

      {/* ================= MENSAGEM ================= */}
      {message && (
        <div
          style={{
            marginBottom: 16,
            padding: 10,
            border: '1px solid #ddd',
            borderRadius: 10,
          }}
        >
          {message}
        </div>
      )}

      {/* ================= BUSCA ================= */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 20,
        }}
      >
        <input
          placeholder="Buscar por nome, SKU ou GTIN"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ flex: 1, padding: 10 }}
        />

        <button onClick={search} disabled={loadingSearch}>
          {loadingSearch ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {/* ================= CONTEÚDO ================= */}
      <div
        style={{
          display: 'flex',
          gap: 20,
          alignItems: 'flex-start',
        }}
      >

        {/* ===== LISTA PRODUTOS ===== */}
        <div style={{ flex: 1 }}>
          <table
            border="1"
            cellPadding="8"
            style={{
              width: '100%',
              borderCollapse: 'collapse',
            }}
          >
            <thead>
              <tr>
                <th>Nome</th>
                <th>GTIN</th>
                <th>Ação</th>
              </tr>
            </thead>

            <tbody>
              {produtos.map((p) => (
                <tr key={p.id}>
                  <td>{p.nome}</td>
                  <td>{p.gtin}</td>
                  <td>
                    <button
                      onClick={() => {
                        setSelectedProduto(p);
                        setSelectedFornecedorId('');
                      }}
                    >
                      Selecionar
                    </button>
                  </td>
                </tr>
              ))}

              {!produtos.length && (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>
                    Nenhum produto encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ===== PAINEL LATERAL ===== */}
        <div style={{ width: 360 }}>

          {selectedProduto ? (

            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: 12,
                padding: 14,
                background: '#fff',
              }}
            >
              <h3 style={{ marginTop: 0 }}>Produto</h3>

              <p><b>Nome:</b> {selectedProduto.nome}</p>
              <p><b>GTIN:</b> {selectedProduto.gtin}</p>
              <p><b>Descrição:</b> {selectedProduto.descricao || '-'}</p>

              {selectedProduto.image_url ? (
                <img
                  src={selectedProduto.image_url}
                  alt=""
                  style={{
                    width: 140,
                    borderRadius: 10,
                    border: '1px solid #ddd',
                  }}
                />
              ) : (
                <div style={{ color: '#777' }}>Sem imagem</div>
              )}

              {/* ===== FORNECEDOR ===== */}
              <div style={{ marginTop: 16 }}>

                <label style={{ fontWeight: 700 }}>
                  Filtrar fornecedores
                </label>

                <input
                  value={fornecedorFilter}
                  onChange={(e) => setFornecedorFilter(e.target.value)}
                  placeholder="Nome ou CNPJ..."
                  style={{
                    width: '100%',
                    padding: 10,
                    marginTop: 6,
                  }}
                />

                <label
                  style={{
                    display: 'block',
                    fontWeight: 700,
                    marginTop: 12,
                  }}
                >
                  Selecionar fornecedor
                </label>

                <select
                  value={selectedFornecedorId}
                  onChange={(e) =>
                    setSelectedFornecedorId(e.target.value)
                  }
                  style={{
                    width: '100%',
                    padding: 10,
                    marginTop: 6,
                  }}
                >
                  <option value="">-- selecione --</option>

                  {fornecedoresFiltrados.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome} ({f.cnpj})
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleAssociar}
                  disabled={!selectedFornecedorId || loadingAssoc}
                  style={{
                    width: '100%',
                    marginTop: 12,
                    padding: 10,
                  }}
                >
                  {loadingAssoc
                    ? 'Associando...'
                    : 'Associar fornecedor'}
                </button>
              </div>
            </div>

          ) : (

            <div
              style={{
                border: '1px dashed #bbb',
                borderRadius: 12,
                padding: 14,
                color: '#777',
              }}
            >
              Selecione um produto
            </div>

          )}
        </div>
      </div>
    </div>
  );
}
 