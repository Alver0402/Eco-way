class LoginUserUseCase {
  constructor(
    private userRepository: any,
    private hashService: any,
    private authService: any
  ) {}

  async execute(email: string, password: string): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const passwordMatches = await this.hashService.compare(password, user.passwordHash);
    if (!passwordMatches) {
      throw new Error('Credenciales inválidas');
    }

    const token = this.authService.generateToken({ id: user.id, email: user.email });
    return { token };
  }
}

module.exports = { LoginUserUseCase };
