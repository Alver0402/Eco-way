const jwt = require('jsonwebtoken');
const { IAuthService } = require('../../domain/services/IAuthService');

const JWT_SECRET = process.env.JWT_SECRET || 'eco_way_secret';

class JwtAuthService {
  // implements IAuthService
  generateToken(payload: object): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  }

  verifyToken(token: string): object {
    return jwt.verify(token, JWT_SECRET);
  }
}

module.exports = { JwtAuthService };
