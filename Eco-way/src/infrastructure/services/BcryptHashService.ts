const bcrypt = require('bcrypt');
const { IHashService } = require('../../domain/services/IHashService');

class BcryptHashService {
  // implements IHashService
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}

module.exports = { BcryptHashService };
