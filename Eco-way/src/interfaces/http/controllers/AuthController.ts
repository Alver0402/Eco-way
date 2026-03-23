const { registerUserUseCase, loginUserUseCase } = require('../../../infrastructure/container');

class AuthController {
  async register(req: any, res: any) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'name, email y password son obligatorios' });
    }

    const user = await registerUserUseCase.execute(name, email, password);

    return res.status(201).json({ id: user.id, name: user.name, email: user.email });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email y password son obligatorios' });
    }

    const { token } = await loginUserUseCase.execute(email, password);
    return res.status(200).json({ token });
  }
}

module.exports = { AuthController };
