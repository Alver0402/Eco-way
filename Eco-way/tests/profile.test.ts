const supertest = require('supertest');
const profileApp = require('../src/app');

describe('Profile API - Sprint 1', () => {
  it('debe obtener y actualizar datos del perfil', async () => {
    await supertest(profileApp)
      .post('/api/auth/register')
      .send({ name: 'Profile User', email: 'profile@eco.com', password: 'Password123' });

    const login = await supertest(profileApp)
      .post('/api/auth/login')
      .send({ email: 'profile@eco.com', password: 'Password123' });

    const token = login.body.token;

    const profile = await supertest(profileApp)
      .get('/api/profile')
      .set('Authorization', `Bearer ${token}`);

    expect(profile.status).toBe(200);
    expect(profile.body.email).toBe('profile@eco.com');

    const updated = await supertest(profileApp)
      .put('/api/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Profile User Updated' });

    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('Profile User Updated');
  });
});
