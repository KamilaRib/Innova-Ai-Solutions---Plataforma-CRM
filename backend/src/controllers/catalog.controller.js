const prisma = require('../lib/prisma');

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
    const { price, ...rest } = req.body;
    const product = await prisma.product.create({
      data: {
        ...rest,
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
    const { price, ...rest } = req.body;
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...rest,
        price: parseFloat(price) || 0
      }
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
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Erro ao excluir produto:', error);
    res.status(500).json({ error: 'Erro ao excluir produto.' });
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
  deleteProduct
};
