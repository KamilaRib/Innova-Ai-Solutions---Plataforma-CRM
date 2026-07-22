const prisma = require('../lib/prisma');

const SECRET_KEY_PATTERN = /(token|api_key|access_token|secret|password|senha)/i;

// Evita gravar segredos/credenciais em texto puro na trilha de auditoria (RNF-SEG-02).
const redact = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  const clone = Array.isArray(obj) ? [...obj] : { ...obj };
  for (const key of Object.keys(clone)) {
    if (SECRET_KEY_PATTERN.test(key) && clone[key]) {
      clone[key] = '[REDACTED]';
    }
  }
  return clone;
};

/**
 * Registra uma entrada imutável na trilha de auditoria (RN009 / RF-SEC-02).
 * Nunca lança erro para o chamador: uma falha ao registrar auditoria não pode
 * derrubar a ação de negócio que está sendo auditada.
 */
const logAudit = async ({ usuario_id, entidade, entidade_id = null, acao, antes = null, depois = null }) => {
  try {
    await prisma.auditoria.create({
      data: { usuario_id, entidade, entidade_id, acao, antes: redact(antes), depois: redact(depois) }
    });
  } catch (error) {
    console.error('Erro ao registrar auditoria:', error);
  }
};

module.exports = { logAudit };
