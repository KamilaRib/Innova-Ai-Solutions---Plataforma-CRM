const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// A "Chave Mestra" que carimba os acessos (deve ir para o arquivo .env futuramente)
const JWT_SECRET = process.env.JWT_SECRET || 'chave-super-segura-white-label';

/**
 * Endpoint de Login com Senha - Separa a Secretária do ADM.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    /*
      TODO: Implementação futura quando o DB for povoado:
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ error: "Usuário não encontrado." });

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) return res.status(401).json({ error: "Senha incorreta!" });
    */

    // ----- SIMULAÇÃO DA LÓGICA DO BANCO (Substituir pela de cima no futuro) -----
    // Vamos imaginar a Secretária ou Administrador tentando entrar...
    const mockUser = {
      id: "usr-002",
      email: email,
      role: email.includes("admin") ? "CLIENT_OWNER" : "AGENT" 
    };
    // ----------------------------------------------------------------------------

    // Geração do Crachá (Token de Acesso JWT) contendo as permissões cruciais
    const token = jwt.sign(
      { 
        user_id: mockUser.id, 
        role: mockUser.role // A Frontend vai usar isso para esconder o Dashboard
      },
      JWT_SECRET,
      { expiresIn: '12h' } // O login expira a cada 12 horas, reforçando a segurança
    );

    // O Frontend recebe esse pacote e abre apenas as portas permitidas
    res.status(200).json({
      success: true,
      token,
      user_data: {
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role 
      }
    });

  } catch (error) {
    console.error("Erro Interno de Login:", error);
    res.status(500).json({ error: "Ocorreu um erro ao processar seu login." });
  }
};

module.exports = {
  login
};
