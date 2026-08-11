const prisma = require('../lib/prisma');

// Simulação de gateway de terceiros (ex: FocusNFe, PlugNotas, etc.)
const GATEWAY_URL = process.env.NFSE_GATEWAY_URL || 'https://api.focusnfe.com.br/v2/nfse';
const GATEWAY_TOKEN = process.env.NFSE_GATEWAY_TOKEN || 'SUA_CHAVE_DE_API_FOCUSNFE';

/**
 * Dispara uma NFS-e para o Gateway Fiscal baseado no Invoice ID.
 * @param {string} invoiceId - ID do invoice
 */
const emitirNFSe = async (invoiceId) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { customer: true }
    });

    if (!invoice) throw new Error("Fatura não encontrada.");
    
    const settings = await prisma.systemSettings.findUnique({ where: { id: "1" } });

    if (!settings.im) {
      throw new Error("Inscrição Municipal da Empresa Emitente não configurada.");
    }
    if (!settings.codigo_servico_municipal) {
      throw new Error("Código de Serviço Municipal não configurado na parametrização fiscal.");
    }

    // Estrutura padrão esperada por Gateways como FocusNFe (simplificado)
    const payload = {
      data_emissao: new Date().toISOString(),
      prestador: {
        cnpj: settings.cnpj?.replace(/\D/g, ''),
        inscricao_municipal: settings.im,
        codigo_municipio: settings.ibge_municipio || "3550308", // SP
      },
      tomador: {
        cnpj_cpf: invoice.customer.document?.replace(/\D/g, ''),
        razao_social: invoice.customer.name,
        email: invoice.customer.email,
        endereco: {
          logradouro: invoice.customer.address,
          codigo_municipio: "3550308", // Opcional: pegaria do IBGE do cliente se houvesse, fixando para SP teste
          uf: invoice.customer.state || "SP"
        }
      },
      servico: {
        aliquota: settings.aliquota_iss ? Number(settings.aliquota_iss) : 0,
        iss_retido: false,
        item_lista_servico: settings.codigo_item_lc116 || "01.03",
        codigo_tributario_municipio: settings.codigo_servico_municipal,
        valor_servicos: Number(invoice.amount_due),
        descricao: invoice.description || "Prestação de Serviços de Agente CRM Innova IA"
      },
      natureza_operacao: "1", // Ex: Tributação no município
      regime_especial_tributacao: settings.regime_especial_tributacao || "6" // 6 = Simples Nacional
    };

    // Aqui seria feito o POST real para a API do Gateway
    console.log("[NFSE_SERVICE] Disparando nota para Gateway Fiscal...", JSON.stringify(payload, null, 2));
    
    // Simulação do POST
    // const response = await axios.post(GATEWAY_URL, payload, { auth: { username: GATEWAY_TOKEN, password: "" }});
    
    // Mock Response
    const response = {
      data: {
        referencia: invoiceId,
        status: "processando_autorizacao",
        numero: "12345", // Gateway reference
      }
    };

    // Atualiza status local para PROCESSANDO
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        fiscal_status: "PROCESSANDO",
        nfse_gateway_id: response.data.numero
      }
    });

    return { success: true, message: "NFS-e enviada ao gateway para processamento.", gatewayRef: response.data.numero };

  } catch (error) {
    console.error("[NFSE_SERVICE] Erro ao emitir NFS-e:", error);
    
    // Atualiza status local para ERRO se foi uma falha síncrona
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { fiscal_status: "ERRO" }
    });

    return { success: false, error: error.message };
  }
};

module.exports = {
  emitirNFSe
};
