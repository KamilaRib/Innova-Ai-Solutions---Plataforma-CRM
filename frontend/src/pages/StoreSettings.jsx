import React, { useState, useContext, useEffect } from 'react';
import { User, Store, ShieldCheck, Palette, Building2, MapPin, Key, FileText, BarChart, Trash2, Copy, CheckCircle, Share2, Image as ImageIcon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { SettingsContext } from '../context/SettingsContext';

const StoreSettings = () => {
  const location = useLocation();
  const { settings, saveSettings } = useContext(SettingsContext);
  const [formData, setFormData] = useState(settings?.store_data || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      // Map both explicit fields and store_data
      setFormData({
        ...settings.store_data,
        im: settings.im || '',
        cnpj: settings.cnpj || '',
        ie: settings.ie || '',
        ibge_municipio: settings.ibge_municipio || '3550308',
        codigo_servico_municipal: settings.codigo_servico_municipal || '',
        codigo_item_lc116: settings.codigo_item_lc116 || '',
        aliquota_iss: settings.aliquota_iss || '',
        regime_especial_tributacao: settings.regime_especial_tributacao || '1'
      });
    }
  }, [settings]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleCheckboxChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.checked});
  };

  const handleSave = async () => {
    if (!formData.im) {
      alert("A Inscrição Municipal é OBRIGATÓRIA para prestadores de serviço em São Paulo.");
      return;
    }

    setIsSaving(true);
    try {
      // Separar campos de store_data dos campos explícitos
      const explicitFields = ['im', 'cnpj', 'ie', 'ibge_municipio', 'codigo_servico_municipal', 'codigo_item_lc116', 'aliquota_iss', 'regime_especial_tributacao'];
      const payload = { store_data: {} };
      
      Object.keys(formData).forEach(key => {
        if (explicitFields.includes(key)) {
          payload[key] = formData[key];
        } else {
          payload.store_data[key] = formData[key];
        }
      });

      // Garantir conversão de Decimal/Number
      if (payload.aliquota_iss) payload.aliquota_iss = parseFloat(payload.aliquota_iss.toString().replace(',', '.'));

      const result = await saveSettings(payload);
      if (result && result.success) {
        alert("Configurações salvas com sucesso!");
      } else {
        alert("Erro ao salvar: " + (result?.error || 'Acesso negado.'));
      }
    } catch (error) {
      alert("Erro de conexão ao salvar configurações.");
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User, path: '/app/settings/profile' },
    { id: 'store', label: 'Dados da Loja & Fiscal', icon: Store, path: '/app/settings/store' },
    { id: 'security', label: 'Segurança', icon: ShieldCheck, path: '/app/settings/security' },
    { id: 'appearance', label: 'Aparência', icon: Palette, path: '/app/settings/branding' },
  ];

  const sectionHeaderStyle = { fontSize: '0.9rem', color: 'var(--color-accent-green)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', fontWeight: '700' };
  const cardStyle = { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '25px', marginBottom: '30px' };
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: '600', marginBottom: '8px', color: '#ccc' };
  const inputStyle = { width: '100%', padding: '12px 15px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', fontSize: '0.85rem', outline: 'none' };
  
  return (
    <div style={{ padding: '20px 40px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '8px' }}>Configurações</h1>
      <p style={{ color: '#aaa', fontSize: '0.95rem', marginBottom: '40px' }}>Gerencie seu perfil e configurações de conta</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '5px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px', marginBottom: '40px', overflowX: 'auto' }}>
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = location.pathname.includes(tab.path);
          return (
            <Link key={tab.id} to={tab.path} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '20px', background: isActive ? 'var(--color-accent-green)' : 'transparent', color: isActive ? '#000' : '#888', textDecoration: 'none', fontSize: '0.85rem', fontWeight: isActive ? '700' : '500', transition: 'all 0.2s ease', whiteSpace: 'nowrap' }}>
              <Icon size={16} />
              {tab.label}
            </Link>
          );
        })}
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '5px' }}>Dados da Empresa & Configurações Fiscais (NFS-e)</h2>
      <p style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '30px' }}>Gerencie os dados cadastrais da empresa, endereço emitente, certificado digital A1 e parametrização fiscal para emissão de Notas Fiscais de Serviço Eletrônica.</p>

      {/* 1. Catálogo Público */}
      <div style={cardStyle}>
        
        <div style={{ background: 'rgba(34, 197, 94, 0.03)', border: '1px solid rgba(34, 197, 94, 0.1)', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '35px' }}>
          <div>
            <h3 style={{ fontSize: '0.85rem', color: 'var(--color-accent-green)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', fontWeight: '800', textTransform: 'uppercase' }}>
              <Share2 size={16} /> CATÁLOGO PÚBLICO DA LOJA
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#888', margin: 0 }}>Link direto para compartilhamento do seu estoque atualizado com clientes:</p>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="text" value="HTTPS://INNOVAAI.NET.BR/C/LOJA" readOnly style={{ padding: '12px 15px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', color: '#ccc', fontSize: '0.75rem', width: '320px', outline: 'none' }} />
            <button style={{ background: 'var(--color-accent-green)', color: '#000', border: 'none', borderRadius: '8px', padding: '0 25px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
              <Copy size={16} /> Copiar
            </button>
          </div>
        </div>
        
        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '700', marginBottom: '15px', color: '#fff' }}>Logotipo da Loja (Recomendado 500x500px)</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '80px', height: '80px', background: '#e5e7eb', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ImageIcon size={30} color="#9ca3af" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <button style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                Choose file
              </button>
              <span style={{ fontSize: '0.85rem', color: '#888' }}>No file chosen</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#555', margin: 0 }}>Exibida no catálogo público, menu lateral e impressões de contrato.</p>
          </div>
        </div>
      </div>

      {/* 2. Identificação */}
      <div style={cardStyle}>
        <h3 style={sectionHeaderStyle}><Building2 size={18} /> 1. IDENTIFICAÇÃO DA EMPRESA</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div><label style={labelStyle}>CNPJ *</label><input type="text" name="cnpj" value={formData.cnpj || ''} onChange={handleChange} style={inputStyle} placeholder="00.000.000/0000-00" /></div>
          <div><label style={labelStyle}>Inscrição Estadual (I.E.) *</label><input type="text" name="ie" value={formData.ie || ''} onChange={handleChange} style={inputStyle} placeholder="ISENTO" /></div>
          <div><label style={labelStyle}>Inscrição Municipal (CCM) *</label><input type="text" name="im" value={formData.im || ''} onChange={handleChange} style={inputStyle} placeholder="Obrigatório" required /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div><label style={labelStyle}>Razão Social *</label><input type="text" name="razao_social" value={formData.razao_social || ''} onChange={handleChange} style={inputStyle} placeholder="Sua Empresa LTDA" /></div>
          <div><label style={labelStyle}>Nome Fantasia</label><input type="text" name="nome_fantasia" value={formData.nome_fantasia || ''} onChange={handleChange} style={inputStyle} placeholder="Sua Loja" /></div>
        </div>
        <div>
          <label style={labelStyle}>Regime Tributário *</label>
          <select name="regime" value={formData.regime || '1'} onChange={handleChange} style={{ ...inputStyle, appearance: 'auto' }}>
            <option value="1">1 - SIMPLES NACIONAL</option>
            <option value="3">3 - REGIME NORMAL</option>
          </select>
        </div>
      </div>

      {/* 3. Endereço */}
      <div style={cardStyle}>
        <h3 style={sectionHeaderStyle}><MapPin size={18} /> 2. ENDEREÇO DA EMPRESA</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '20px', marginBottom: '20px' }}>
          <div><label style={labelStyle}>CEP *</label><input type="text" name="cep" value={formData.cep || ''} onChange={handleChange} style={inputStyle} placeholder="00000-000" /></div>
          <div><label style={labelStyle}>Código IBGE Município *</label><input type="text" name="ibge_municipio" value={formData.ibge_municipio || '3550308'} onChange={handleChange} style={inputStyle} placeholder="Ex: 3550308" /></div>
          <div><label style={labelStyle}>Logradouro / Endereço *</label><input type="text" name="logradouro" value={formData.logradouro || ''} onChange={handleChange} style={inputStyle} placeholder="Rua..." /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '20px', marginBottom: '20px' }}>
          <div><label style={labelStyle}>Número *</label><input type="text" name="numero" value={formData.numero || ''} onChange={handleChange} style={inputStyle} placeholder="123" /></div>
          <div><label style={labelStyle}>Complemento</label><input type="text" name="complemento" value={formData.complemento || ''} onChange={handleChange} style={inputStyle} placeholder="Sala 1" /></div>
          <div><label style={labelStyle}>Bairro *</label><input type="text" name="bairro" value={formData.bairro || ''} onChange={handleChange} style={inputStyle} placeholder="Centro" /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '20px' }}>
          <div><label style={labelStyle}>Município / Cidade *</label><input type="text" name="municipio" value={formData.municipio || ''} onChange={handleChange} style={inputStyle} placeholder="São Paulo" /></div>
          <div><label style={labelStyle}>UF *</label><input type="text" name="uf" value={formData.uf || ''} onChange={handleChange} style={inputStyle} placeholder="SP" /></div>
          <div><label style={labelStyle}>Telefone da Empresa</label><input type="text" name="telefone" value={formData.telefone || ''} onChange={handleChange} style={inputStyle} placeholder="(11) 99999-9999" /></div>
        </div>
      </div>

      {/* 4. Certificado */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ ...sectionHeaderStyle, marginBottom: 0 }}><Key size={18} /> 3. CERTIFICADO DIGITAL A1</h3>
          <span style={{ fontSize: '0.75rem', color: '#888', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', opacity: 0.8 }}><CheckCircle size={14} /> Testar Conexão Fiscal</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div>
            <label style={labelStyle}>Upload do Certificado Digital (.pfx / .p12)</label>
            <input type="file" style={{ fontSize: '0.8rem', color: '#ccc', marginTop: '10px' }} />
          </div>
          <div>
            <label style={labelStyle}>Senha do Certificado Digital</label>
            <input type="password" name="certificado_senha" value={formData.certificado_senha || ''} onChange={handleChange} style={inputStyle} placeholder="Senha do arquivo .pfx" />
          </div>
        </div>
      </div>

      {/* 5. Parametrização NFS-e */}
      <div style={cardStyle}>
        <h3 style={sectionHeaderStyle}><FileText size={18} /> 4. PARAMETRIZAÇÃO FISCAL E IMPOSTOS (NFS-e)</h3>
        <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '20px' }}>Configurações específicas para Notas Fiscais de Serviço (Prefeitura de São Paulo).</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div>
            <label style={labelStyle}>Código de Serviço Municipal (SP) *</label>
            <input type="text" name="codigo_servico_municipal" value={formData.codigo_servico_municipal || ''} onChange={handleChange} style={inputStyle} placeholder="Ex: 01015" />
          </div>
          <div>
            <label style={labelStyle}>Código do Item da LC 116/03 *</label>
            <input type="text" name="codigo_item_lc116" value={formData.codigo_item_lc116 || ''} onChange={handleChange} style={inputStyle} placeholder="Ex: 01.03" />
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Alíquota Padrão do ISS (%) *</label>
            <input type="number" step="0.01" name="aliquota_iss" value={formData.aliquota_iss || ''} onChange={handleChange} style={inputStyle} placeholder="Ex: 2.0" />
          </div>
          <div>
            <label style={labelStyle}>Regime Especial de Tributação *</label>
            <select name="regime_especial_tributacao" value={formData.regime_especial_tributacao || '1'} onChange={handleChange} style={{ ...inputStyle, appearance: 'auto' }}>
              <option value="1">Microempresa Municipal</option>
              <option value="2">Estimativa</option>
              <option value="3">Sociedade de Profissionais</option>
              <option value="4">Cooperativa</option>
              <option value="5">Microempresário Individual (MEI)</option>
              <option value="6">Microempresa ou EPP (Simples Nacional)</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px', marginBottom: '80px' }}>
        <button onClick={handleSave} disabled={isSaving} style={{ background: 'var(--color-accent-green)', color: '#000', border: 'none', borderRadius: '8px', padding: '15px 30px', fontWeight: '800', cursor: 'pointer', fontSize: '1rem', transition: 'all 0.2s', opacity: isSaving ? 0.7 : 1 }}>
          {isSaving ? 'Salvando...' : 'Salvar Configurações Fiscais e da Loja'}
        </button>
      </div>

    </div>
  );
};

export default StoreSettings;
