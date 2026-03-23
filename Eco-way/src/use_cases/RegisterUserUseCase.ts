const { User } = require('../domain/entities/User');

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;
}

class RegisterUserUseCase {
  constructor(private userRepository: any, private hashService: any) {}

  async execute(name: string, email: string, password: string): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new Error('Email ya registrado');
    }

    const hashed = await this.hashService.hash(password);
    const user = User.create({ id: generateId(), name, email, passwordHash: hashed });
    await this.userRepository.save(user);
    return user;
  }
}

module.exports = { RegisterUserUseCase };
