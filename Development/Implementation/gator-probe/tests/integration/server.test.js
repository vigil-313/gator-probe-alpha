/**
 * Integration tests for the Express server
 */

import request from 'supertest';
import app from '../../src/server.js';

describe('Express Server', () => {
  test('GET / returns HTML', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  test('GET /health returns status information', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'healthy');
    expect(response.body).toHaveProperty('version', '0.1.0');
  });

  test('POST /api/gator returns 501 not implemented', async () => {
    const response = await request(app)
      .post('/api/gator')
      .send({
        idea: 'Test idea',
        persona: 'rex'
      });
    
    expect(response.status).toBe(501);
    expect(response.body).toHaveProperty('message', 'Gator API not yet implemented');
  });

  test('GET /nonexistent returns 404', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).toBe(404);
  });
});