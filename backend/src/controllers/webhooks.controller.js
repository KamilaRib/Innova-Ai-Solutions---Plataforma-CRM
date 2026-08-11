const prisma = require('../lib/prisma');

/**
 * Endpoint passivo que recebe atualizações do Gateway Fiscal (ex: FocusNFe)
 * sobre o status do processamento da NFS-e na prefeitura.
 */
const handleNFSeWebhook = async (req, res) => {
  try {
    // Exemplo de Payload do Gateway:
    // {
    //   "referencia": "id-do-invoice",
    //   "status": "autorizado",
    //   "numero": "12345",
    //   "caminho_xml_nota_fiscal": "https://api.focusnfe.com.br/.../nota.xml",
    //   "caminho_danfe": "https://api.focusnfe.com.br/.../nota.pdf"
    // }

    const { referencia, status, caminho_xml_nota_fiscal, caminho_danfe } = req.body;

    if (!referencia || !status) {
      return res.status(400).json({ error: "Payload inválido. 'referencia' e 'status' são obrigatórios." });
    }

    // Tradução de status do Gateway para o nosso sistema
    let newStatus = "PROCESSANDO";
    if (status === "autorizado") newStatus = "AUTORIZADA";
    if (status === "erro_autorizacao" || status === "cancelado") newStatus = "REJEITADA";

    const updateData = {
      fiscal_status: newStatus
    };

    if (caminho_xml_nota_fiscal) updateData.nfse_xml_url = caminho_xml_nota_fiscal;
    if (caminho_danfe) updateData.nfse_pdf_url = caminho_danfe;

    // Atualiza a Fatura (Invoice)
    await prisma.invoice.update({
      where: { id: referencia },
      data: updateData
    });

    console.log(`[WEBHOOK_NFSE] Invoice ${referencia} atualizado para status ${newStatus}.`);

    return res.status(200).json({ success: true, message: "Webhook processado com sucesso." });
  } catch (error) {
    console.error("[WEBHOOK_NFSE] Erro ao processar webhook:", error);
    // Mesmo com erro, respondemos 200 pro gateway não ficar re-tentando infinitamente em caso de erro lógico
    return res.status(200).json({ success: false, error: "Erro interno no processamento do webhook." });
  }
};

module.exports = {
  handleNFSeWebhook
};
