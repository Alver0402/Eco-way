export interface IAuthService {
  generateToken(payload: object): string;
  verifyToken(token: string): object;
}
