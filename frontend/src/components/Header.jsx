import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Header({ title, showBack = true }) {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <h2 style={styles.title}>{title}</h2>

      {showBack && (
        <button
          onClick={() => navigate('/')}
          style={styles.backButton}
        >
          Voltar
        </button>
      )}
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  title: {
    margin: 0,
    fontSize: 22,
    fontWeight: 700,
  },
  backButton: {
    padding: '8px 14px',
    borderRadius: 8,
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 600,
  },
};
