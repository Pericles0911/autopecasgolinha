import React, { useEffect, useState } from 'react';
import api from '../api/api';

export default function SearchProdutos({
  onSelect,
  placeholder = 'Buscar por nome, SKU ou código de barras',
}) {
  const [query, setQuery] = useState('');
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  async function search() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.get('/produtos', { params: { q: query } });
      setProdutos(res.data || []);
    } catch {
      setProdutos([]);
      setMessage('Não foi possível buscar produtos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // busca inicial
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={styles.wrap}>
      <div style={styles.row}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          style={styles.input}
        />
        <button onClick={search} disabled={loading} style={styles.btn}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {message ? <div style={styles.msg}>{message}</div> : null}

      <div style={styles.list}>
        {produtos.map((p) => (
          <div key={p.id} style={styles.item}>
            <div style={{ flex: 1 }}>
              <div style={styles.name}>{p.nome}</div>
              <div style={styles.meta}>
                <span><b>GTIN:</b> {p.gtin}</span>
                {p.sku ? <span> • <b>SKU:</b> {p.sku}</span> : null}
              </div>
            </div>
            <button onClick={() => onSelect?.(p)} style={styles.btnGhost}>
              Selecionar
            </button>
          </div>
        ))}
        {!produtos.length && !loading ? (
          <div style={styles.empty}>Nenhum produto encontrado</div>
        ) : null}
      </div>
    </div>
  );
}

const styles = {
  wrap: { display: 'grid', gap: 10 },
  row: { display: 'flex', gap: 8, alignItems: 'center' },
  input: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #ddd',
    flex: 1,
  },
  btn: {
    padding: '10px 12px',
    borderRadius: 10,
    border: 'none',
    background: '#111',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 800,
    whiteSpace: 'nowrap',
  },
  btnGhost: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
  },
  msg: { padding: 10, border: '1px solid #eee', borderRadius: 10 },
  list: { display: 'grid', gap: 8 },
  item: {
    border: '1px solid #eee',
    borderRadius: 12,
    padding: 10,
    display: 'flex',
    gap: 10,
    alignItems: 'center',
  },
  name: { fontWeight: 900 },
  meta: { color: '#666', fontSize: 13, marginTop: 4 },
  empty: { color: '#777', padding: 10, border: '1px dashed #ccc', borderRadius: 12 },
};
