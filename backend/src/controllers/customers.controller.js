const prisma = require('../lib/prisma');

class CustomersController {
  async upsertCustomer(req, res) {
    try {
      const { name, phone, email, document, address, city, state, zip_code, lead_id } = req.body;

      if (!phone) {
        return res.status(400).json({ error: 'O telefone é obrigatório.' });
      }

      // Upsert Customer
      const customer = await prisma.customer.upsert({
        where: { phone },
        update: {
          name,
          email,
          document,
          address,
          city,
          state,
          zip_code,
          status: 'ACTIVE'
        },
        create: {
          name,
          phone,
          email,
          document,
          address,
          city,
          state,
          zip_code,
          status: 'ACTIVE'
        }
      });

      // Se houver um lead_id, vincula o lead ao novo cliente
      if (lead_id) {
        await prisma.lead.update({
          where: { id: lead_id },
          data: { customer_id: customer.id }
        });
      }

      return res.status(200).json(customer);
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      return res.status(500).json({ error: 'Erro interno ao salvar cliente.' });
    }
  }

  async getCustomerByPhone(req, res) {
    try {
      const { phone } = req.params;
      const customer = await prisma.customer.findUnique({
        where: { phone }
      });

      if (!customer) {
        return res.status(404).json({ error: 'Cliente não encontrado.' });
      }

      return res.status(200).json(customer);
    } catch (error) {
      console.error('Erro ao buscar cliente:', error);
      return res.status(500).json({ error: 'Erro interno ao buscar cliente.' });
    }
  }
}

module.exports = new CustomersController();
