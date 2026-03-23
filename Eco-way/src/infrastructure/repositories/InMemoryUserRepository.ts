const { User } = require('../../domain/entities/User');

const users: Map<string, any> = new Map();

class InMemoryUserRepository {
  // implements IUserRepository
  async findById(id: string): Promise<User | null> {
    return users.get(id) ?? null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = Array.from(users.values()).find((u) => u.email === email);
    return found ?? null;
  }

  async save(user: User): Promise<void> {
    users.set(user.id, user);
  }
}

module.exports = { InMemoryUserRepository };

