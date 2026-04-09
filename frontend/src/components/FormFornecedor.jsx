import React, { useMemo, useState } from 'react';
import api from '../api/api';

/* ======================
   Funções de máscara
====================== */
function onlyDigits(v) {
  return (v || '').replace(/\D/g, '');
}

function maskCNPJ(value) {
  return value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .slice(0, 18);
}

function maskTelefone(value) {
  const digits = onlyDigits(value);

  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .slice(0, 14);
  }

  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
    .slice(0, 15);
}

/* ======================
   Componente
====================== */
export default function FormFornecedor() {
  const [form, setForm] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    contato_principal: '',
  });

  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  const cnpjDigits = useMemo(() => onlyDigits(form.cnpj), [form.cnpj]);
  const telDigits = useMemo(() => onlyDigits(form.telefone), [form.telefone]);

  const errors = useMemo(() => {
    const e = {};

    if (!form.nome.trim()) e.nome = 'Informe o nome do fornecedor.';
    if (!cnpjDigits) e.cnpj = 'Informe o CNPJ.';
    else if (cnpjDigits.length !== 14) e.cnpj = 'CNPJ deve ter 14 dígitos.';

    if (!telDigits) e.telefone = 'Informe o telefone.';
    else if (![10, 11].includes(telDigits.length)) e.telefone = 'Telefone deve ter 10 ou 11 dígitos.';

    if (!form.email.trim()) e.email = 'Informe o e-mail.';
    // validação simples de e-mail (o backend também valida)
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'E-mail inválido.';

    // endereço e contato são opcionais (se quiser obrigar, eu ajusto)
    return e;
  }, [form.nome, cnpjDigits, telDigits, form.email]);

  const isValid = Object.keys(errors).length === 0;

  function markTouched(name) {
    setTouched(prev => ({ ...prev, [name]: true }));
  }

  function resetForm() {
  setForm({
    nome: '',
    cnpj: '',
    endereco: '',
    telefone: '',
    email: '',
    contato_principal: '',
  });
  setTouched({});
}

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    // força exibir erros se tentar enviar
    setTouched({
      nome: true,
      cnpj: true,
      telefone: true,
      email: true,
      endereco: true,
      contato_principal: true,
    });

    if (!isValid) return;

    setSubmitting(true);
try {
  await api.post('/fornecedores', form);

  // ✅ mensagem deve ficar AQUI
  setMessage('Fornecedor cadastrado com sucesso!');

  // ✅ limpa apenas os campos
  resetForm();
} catch (err) {
  // ✅ mensagem de erro
  setMessage(
    err.response?.data?.message || 'Erro ao cadastrar fornecedor.'
  );
} finally {
  // ✅ apenas controla loading
  setSubmitting(false);
}
  }
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: 10 }}>
        {/* Nome */}
        <div style={{ display: 'grid', gap: 6 }}>
          <input
            name="nome"
            placeholder="Nome do fornecedor"
            value={form.nome}
            onChange={e => setForm({ ...form, nome: e.target.value })}
            onBlur={() => markTouched('nome')}
            required
          />
          {touched.nome && errors.nome && <small style={{ color: 'crimson' }}>{errors.nome}</small>}
        </div>

        {/* CNPJ */}
        <div style={{ display: 'grid', gap: 6 }}>
          <input
            name="cnpj"
            placeholder="CNPJ"
            value={form.cnpj}
            onChange={e => setForm({ ...form, cnpj: maskCNPJ(e.target.value) })}
            onBlur={() => markTouched('cnpj')}
            required
          />
          {touched.cnpj && errors.cnpj && <small style={{ color: 'crimson' }}>{errors.cnpj}</small>}
        </div>

        {/* Endereço */}
        <div style={{ display: 'grid', gap: 6 }}>
          <textarea
            name="endereco"
            placeholder="Endereço completo"
            value={form.endereco}
            onChange={e => setForm({ ...form, endereco: e.target.value })}
            onBlur={() => markTouched('endereco')}
            rows={3}
          />
        </div>

        {/* Telefone */}
        <div style={{ display: 'grid', gap: 6 }}>
          <input
            name="telefone"
            placeholder="Telefone"
            value={form.telefone}
            onChange={e => setForm({ ...form, telefone: maskTelefone(e.target.value) })}
            onBlur={() => markTouched('telefone')}
            required
          />
          {touched.telefone && errors.telefone && <small style={{ color: 'crimson' }}>{errors.telefone}</small>}
        </div>

        {/* Email */}
        <div style={{ display: 'grid', gap: 6 }}>
          <input
            name="email"
            placeholder="E-mail"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            onBlur={() => markTouched('email')}
            required
          />
          {touched.email && errors.email && <small style={{ color: 'crimson' }}>{errors.email}</small>}
        </div>

        {/* Contato principal */}
        <div style={{ display: 'grid', gap: 6 }}>
          <input
            name="contato_principal"
            placeholder="Contato principal"
            value={form.contato_principal}
            onChange={e => setForm({ ...form, contato_principal: e.target.value })}
            onBlur={() => markTouched('contato_principal')}
          />
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
          <button type="submit" disabled={submitting || !isValid} style={{ flex: 1 }}>
            {submitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <button type="button" onClick={resetForm} disabled={submitting} style={{ flex: 1 }}>
            Cancelar
          </button>
        </div>

        {message && (
          <div style={{ marginTop: 8, padding: 10, border: '1px solid #ddd', borderRadius: 10 }}>
            {message}
          </div>
        )}
      </div>
    </form>
  );
}
