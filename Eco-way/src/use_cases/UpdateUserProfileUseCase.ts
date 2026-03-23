class UpdateUserProfileUseCase {
  constructor(private userRepository: any) {}

  async execute(userId: string, name: string): Promise<{ id: string; name: string; email: string }> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    const updatedUser = user.updateName(name);
    await this.userRepository.save(updatedUser);
    return { id: updatedUser.id, name: updatedUser.name, email: updatedUser.email };
  }
}

module.exports = { UpdateUserProfileUseCase };
