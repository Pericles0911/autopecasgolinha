import React, { useMemo, useRef, useState } from 'react';
import api from '../api/api';

function onlyDigits(v) {
  return (v || '').replace(/\D/g, '');
}

function maskGTIN(value) {
  return onlyDigits(value).slice(0, 14);
}

export default function FormProduto() {
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    sku: '',
    nome: '',
    gtin: '',
    descricao: '',
    quantidade: 0,
    categoria: '',
    validade: '',
    image_url: '', // só usado no modo URL
  });

  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // imageMode:
  // - 'url': usuário cola uma URL e ela é salva no backend
  // - 'upload': usuário seleciona um arquivo e só vemos preview (NÃO salva no backend)
  const [imageMode, setImageMode] = useState('url');

  // previewUrl é o que exibimos na tela (pode vir da URL digitada ou do arquivo local)
  const [previewUrl, setPreviewUrl] = useState('');

  // file local (não vai pro backend)
  const [localFile, setLocalFile] = useState(null);

  const gtinDigits = useMemo(() => onlyDigits(form.gtin), [form.gtin]);

  const errors = useMemo(() => {
    const e = {};
    if (!form.nome.trim()) e.nome = 'Informe o nome do produto.';
    if (!gtinDigits) e.gtin = 'Informe o código de barras (GTIN).';
    return e;
  }, [form.nome, gtinDigits]);

  const isValid = Object.keys(errors).length === 0;

  function clearLocalPreview() {
    // se era preview de arquivo, libera memória
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl('');
    setLocalFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function resetForm() {
    setForm({
      sku: '',
      nome: '',
      gtin: '',
      descricao: '',
      quantidade: 0,
      categoria: '',
      validade: '',
      image_url: '',
    });
    setImageMode('url');
    clearLocalPreview();
  }

  function switchToUrlMode() {
    setImageMode('url');
    setMessage(null);

    // ao voltar pra URL mode, usamos a URL do campo para preview
    // e limpamos o arquivo local
    setLocalFile(null);
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    const url = (form.image_url || '').trim();
    setPreviewUrl(url);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function switchToUploadMode() {
    setImageMode('upload');
    setMessage(null);

    // no upload mode, NUNCA usamos image_url para salvar
    // (você pode manter o texto no input, mas ele não será enviado)
    setForm((prev) => ({ ...prev, image_url: '' }));
    // limpamos preview de URL se houver
    if (previewUrl && !previewUrl.startsWith('blob:')) {
      setPreviewUrl('');
    }
  }

  function handleUrlChange(v) {
    setForm((prev) => ({ ...prev, image_url: v }));
    setPreviewUrl(v.trim());
  }

  function handleFileChange(file) {
    setMessage(null);

    if (!file) {
      clearLocalPreview();
      return;
    }

    // validação leve (opcional)
    if (!file.type.startsWith('image/')) {
      setMessage('Selecione um arquivo de imagem (PNG/JPG/WebP etc).');
      clearLocalPreview();
      return;
    }

    // limpa preview anterior (se era blob)
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }

    const blobUrl = URL.createObjectURL(file);
    setLocalFile(file);
    setPreviewUrl(blobUrl);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage(null);

    if (!isValid) {
      setMessage('Corrija os campos obrigatórios antes de cadastrar.');
      return;
    }

    setSubmitting(true);
    try {
      // ⚠️ IMPORTANTE:
      // Se imageMode === 'upload', NÃO enviamos image_url (porque é só preview).
      // Se imageMode === 'url', enviamos image_url normalmente.
      const payload = {
        ...form,
        gtin: gtinDigits,
        quantidade: Number(form.quantidade || 0),
        validade: form.validade || null,
        image_url: imageMode === 'url' ? (form.image_url || null) : null,
      };

      await api.post('/produtos', payload);

      setMessage(
        imageMode === 'upload'
          ? 'Produto cadastrado com sucesso! (Imagem ficou apenas como preview — para salvar imagem, use URL.)'
          : 'Produto cadastrado com sucesso!'
      );

      resetForm();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Erro ao cadastrar produto.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gap: 14 }}>
        {/* Identificação */}
        <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Identificação</div>

          <div style={{ display: 'grid', gap: 10 }}>
            <input
              name="nome"
              placeholder="Nome do produto *"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              required
            />
            {errors.nome && <small style={{ color: 'crimson' }}>{errors.nome}</small>}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input
                name="sku"
                placeholder="SKU (opcional)"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />

              <input
                name="gtin"
                placeholder="Código de barras (GTIN) *"
                value={form.gtin}
                onChange={(e) => setForm({ ...form, gtin: maskGTIN(e.target.value) })}
                required
              />
            </div>
            {errors.gtin && <small style={{ color: 'crimson' }}>{errors.gtin}</small>}
          </div>
        </div>

        {/* Detalhes */}
        <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Detalhes</div>

          <div style={{ display: 'grid', gap: 10 }}>
            <textarea
              name="descricao"
              placeholder="Descrição (opcional)"
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              rows={3}
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
              <input
                name="categoria"
                placeholder="Categoria (opcional)"
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              />

              <input
                name="quantidade"
                type="number"
                min="0"
                placeholder="Quantidade"
                value={form.quantidade}
                onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
              />

              <input
                name="validade"
                type="date"
                value={form.validade}
                onChange={(e) => setForm({ ...form, validade: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Imagem */}
        <div style={{ border: '1px solid #eee', borderRadius: 12, padding: 14 }}>
          <div style={{ fontWeight: 800, marginBottom: 10 }}>Imagem do produto</div>

          <div style={{ display: 'grid', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" onClick={switchToUrlMode} disabled={imageMode === 'url'}>
                Usar URL
              </button>
              <button type="button" onClick={switchToUploadMode} disabled={imageMode === 'upload'}>
                Upload (apenas preview)
              </button>

              <button type="button" onClick={clearLocalPreview} disabled={!previewUrl}>
                Remover imagem
              </button>
            </div>

            {imageMode === 'url' ? (
              <input
                name="image_url"
                placeholder="Cole a URL da imagem (opcional)"
                value={form.image_url}
                onChange={(e) => handleUrlChange(e.target.value)}
              />
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files?.[0])}
                />
                <small style={{ color: '#666' }}>
                  Upload aqui é <b>só preview</b>. O sistema não envia o arquivo para o backend ainda.
                  Para salvar a imagem no produto, use o modo <b>URL</b>.
                </small>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  style={{
                    width: 140,
                    height: 140,
                    objectFit: 'cover',
                    borderRadius: 10,
                    border: '1px solid #ddd',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 140,
                    height: 140,
                    borderRadius: 10,
                    border: '1px dashed #bbb',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#777',
                  }}
                >
                  Sem preview
                </div>
              )}

              <div style={{ color: '#666' }}>
                {imageMode === 'upload' && localFile ? (
                  <>
                    <div><b>Arquivo:</b> {localFile.name}</div>
                    <div><b>Tamanho:</b> {(localFile.size / 1024).toFixed(0)} KB</div>
                  </>
                ) : (
                  <div>
                    {imageMode === 'url'
                      ? 'Cole uma URL para salvar no produto.'
                      : 'Selecione um arquivo para preview.'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button type="submit" disabled={submitting || !isValid} style={{ flex: 1 }}>
            {submitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          <button type="button" onClick={resetForm} disabled={submitting} style={{ flex: 1 }}>
            Cancelar
          </button>
        </div>

        {message && (
          <div style={{ marginTop: 4, padding: 10, border: '1px solid #ddd', borderRadius: 10 }}>
            {message}
          </div>
        )}
      </div>
    </form>
  );
}
