const { JwtAuthService } = require('../../../infrastructure/services/JwtAuthService');

const authService = new JwtAuthService();

function authMiddleware(req: any, res: any, next: any) {
  const authorization = req.header('Authorization');

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    req.user = authService.verifyToken(token) as { id: string; email: string };
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

module.exports = { authMiddleware };
