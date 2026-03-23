const supertest = require('supertest');
const authApp = require('../src/app');

describe('Auth API - Sprint 1 basics', () => {
  it('debe registrar un nuevo usuario', async () => {
    const response = await supertest(authApp)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@eco.com', password: 'Password123' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@eco.com');
  });

  it('debe iniciar sesion y devolver token', async () => {
    await supertest(authApp)
      .post('/api/auth/register')
      .send({ name: 'Test User2', email: 'test2@eco.com', password: 'Password123' });

    const login = await supertest(authApp)
      .post('/api/auth/login')
      .send({ email: 'test2@eco.com', password: 'Password123' });

    expect(login.status).toBe(200);
    expect(login.body).toHaveProperty('token');
  });
});
