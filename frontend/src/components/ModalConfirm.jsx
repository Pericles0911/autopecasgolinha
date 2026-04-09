import React from 'react';

export default function ModalConfirm({
  open,
  title = 'Confirmar ação',
  message = 'Tem certeza?',
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <div style={styles.backdrop} onClick={onCancel}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <p style={{ marginTop: 8 }}>{message}</p>

        <div style={styles.actions}>
          <button style={styles.btnGhost} onClick={onCancel} disabled={loading}>
            {cancelText}
          </button>
          <button style={styles.btnDanger} onClick={onConfirm} disabled={loading}>
            {loading ? 'Aguarde...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  backdrop: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.35)',
    display: 'grid',
    placeItems: 'center',
    zIndex: 9999,
    padding: 16,
  },
  modal: {
    width: 'min(520px, 100%)',
    background: '#fff',
    borderRadius: 12,
    border: '1px solid #ddd',
    padding: 16,
    boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
  },
  actions: {
    marginTop: 16,
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 10,
  },
  btnGhost: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #ddd',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 700,
  },
  btnDanger: {
    padding: '10px 12px',
    borderRadius: 10,
    border: '1px solid #d33',
    background: '#ffefef',
    cursor: 'pointer',
    fontWeight: 800,
  },
};
