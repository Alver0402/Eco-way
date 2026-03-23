const { getUserProfileUseCase, updateUserProfileUseCase } = require('../../../infrastructure/container');

class ProfileController {
  async getProfile(req: any, res: any) {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    const profile = await getUserProfileUseCase.execute(user.id);
    return res.status(200).json(profile);
  }

  async updateProfile(req: any, res: any) {
    const user = req.user;
    const { name } = req.body;

    if (!user) {
      return res.status(401).json({ message: 'No autenticado' });
    }

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ message: 'name es obligatorio y debe ser string' });
    }

    const updated = await updateUserProfileUseCase.execute(user.id, name);
    return res.status(200).json(updated);
  }
}

module.exports = { ProfileController };
