const prisma = require('../lib/prisma');
const { logAudit } = require('../services/audit.service');
const { emitirNFSe } = require('../services/nfse.service');

/**
 * CREATIVES
 */
const getCreatives = async (req, res) => {
  try {
    const creatives = await prisma.creative.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.status(200).json({ success: true, data: creatives });
  } catch (error) {
    console.error('Erro ao buscar criativos:', error);
    res.status(500).json({ error: 'Erro ao buscar criativos.' });
  }
};

const createCreative = async (req, res) => {
  try {
    const creative = await prisma.creative.create({
      data: req.body
    });
    res.status(201).json({ success: true, data: creative });
  } catch (error) {
    console.error('Erro ao criar criativo:', error);
    res.status(500).json({ error: 'Erro ao criar criativo.' });
  }
};

const updateCreative = async (req, res) => {
  try {
    const { id } = req.params;
    const creative = await prisma.creative.update({
      where: { id },
      data: req.body
    });
    res.status(200).json({ success: true, data: creative });
  } catch (error) {
    console.error('Erro ao atualizar criativo:', error);
    res.status(500).json({ error: 'Erro ao atualizar criativo.' });
  }
};

const deleteCreative = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.creative.delete({ where: { id } });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir criativo:', error);
    res.status(500).json({ error: 'Erro ao excluir criativo.' });
  }
};

/**
 * PRODUCTS
 */
const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { created_at: 'desc' }
    });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro ao buscar produtos.' });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, desc, price, category, image_url } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        desc,
        category,
        image_url,
        price: parseFloat(price) || 0
      }
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    res.status(500).json({ error: 'Erro ao criar produto.' });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, desc, price, category, image_url } = req.body;
    
    // Filtra undefined para não sobrescrever com nulo acidentalmente
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (desc !== undefined) updateData.desc = desc;
    if (category !== undefined) updateData.category = category;
    if (image_url !== undefined) updateData.image_url = image_url;
    if (price !== undefined) updateData.price = parseFloat(price) || 0;

    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('Erro ao atualizar produto:', error);
    res.status(500).json({ error: 'Erro ao atualizar produto.' });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Produto removido com sucesso' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover produto' });
  }
};

const emitDemoNFSe = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: 'Produto não encontrado' });

    // Cria um cliente e invoice dummy para simular a emissão a partir do catálogo
    const customer = await prisma.customer.upsert({
      where: { phone: '00000000000' },
      update: {},
      create: { name: 'Cliente Demonstração', phone: '00000000000', document: '00000000000', address: 'Rua Demo, 123' }
    });

    const invoice = await prisma.invoice.create({
      data: {
        customer_id: customer.id,
        created_by: req.user.user_id,
        stripe_invoice_id: `demo_${Date.now()}`,
        stripe_customer_id: 'demo_cust',
        description: `Venda de: ${product.name}`,
        amount_due: product.price,
        status: 'paid'
      }
    });

    const result = await emitirNFSe(invoice.id);
    
    if (result.success) {
      res.status(200).json({ success: true, message: result.message, invoice_id: invoice.id });
    } else {
      res.status(500).json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error("Erro no demo NFSe:", error);
    res.status(500).json({ error: 'Erro ao emitir NFS-e de demonstração' });
  }
};

module.exports = {
  getCreatives,
  createCreative,
  updateCreative,
  deleteCreative,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  emitDemoNFSe
};
