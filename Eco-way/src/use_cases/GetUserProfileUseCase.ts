class GetUserProfileUseCase {
  constructor(private userRepository: any) {}

  async execute(userId: string): Promise<{ id: string; name: string; email: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    return { id: user.id, name: user.name, email: user.email };
  }
}

module.exports = { GetUserProfileUseCase };
