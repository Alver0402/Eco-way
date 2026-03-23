const { InMemoryUserRepository } = require('./repositories/InMemoryUserRepository');
const { BcryptHashService } = require('./services/BcryptHashService');
const { JwtAuthService } = require('./services/JwtAuthService');

const { RegisterUserUseCase } = require('../use_cases/RegisterUserUseCase');
const { LoginUserUseCase } = require('../use_cases/LoginUserUseCase');
const { GetUserProfileUseCase } = require('../use_cases/GetUserProfileUseCase');
const { UpdateUserProfileUseCase } = require('../use_cases/UpdateUserProfileUseCase');

const userRepository = new InMemoryUserRepository();
const hashService = new BcryptHashService();
const authService = new JwtAuthService();

module.exports = {
  registerUserUseCase: new RegisterUserUseCase(userRepository, hashService),
  loginUserUseCase: new LoginUserUseCase(userRepository, hashService, authService),
  getUserProfileUseCase: new GetUserProfileUseCase(userRepository),
  updateUserProfileUseCase: new UpdateUserProfileUseCase(userRepository)
};
