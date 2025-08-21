import request from 'supertest';
import express from 'express';
import { signIn } from '../../controllers/authController';

const app = express();
app.use(express.json());

// Mock the auth service
jest.mock('../../services/authService', () => ({
  signInService: jest.fn()
}));

describe('Auth Controller', () => {
  describe('POST /signIn', () => {
    it('should return 400 for invalid email', async () => {
      const response = await request(app)
        .post('/signIn')
        .send({
          email: 'invalid-email',
          password: 'password123'
        });

      expect(response.status).toBe(400);
    });

    it('should return 400 for missing password', async () => {
      const response = await request(app)
        .post('/signIn')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
    });
  });
});
