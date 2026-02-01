/** backend.test.mjs */
import { vi } from 'vitest';
import request from 'supertest';
import { app, port, connection } from './server.mjs';

// Mock the database connection with the correct default export
vi.mock('mysql2/promise', () => {
  const mockConnection = {
    query: vi.fn(),
    execute: vi.fn()
  };
  return {
    default: {
      createConnection: vi.fn().mockResolvedValue(mockConnection)
    }
  };
});

describe('Server connections', () => {
  test('backend port', async () => {
    expect(port).toBeGreaterThanOrEqual(1);
  });

  test('MySQL connection', async () => {
    expect(connection).not.toBeNull();
  });

  test('app', async () => {
    expect(app).not.toBeNull();
  });
});

describe('Raw test endpoints', () => {
  test('GET /messages', async () => {
    const mockResults = [{ id: 1, thread_id: 1, role: 'user', message_content: 'Hello' }];
    const mockFields = [];
    connection.query.mockResolvedValue([mockResults, mockFields]);

    const res = await request(app).get('/messages');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('results');
    expect(res.body).toHaveProperty('fields');
  });
});

describe('POST /messages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should insert a message with valid data', async () => {
    const mockResult = { insertId: 1, affectedRows: 1 };
    connection.execute.mockResolvedValue([mockResult, []]);

    const response = await request(app)
      .post('/messages')
      .send({ role: 'user', message_content: 'Hello, world!' })
      .expect(201);

    expect(response.body).toHaveProperty('result');
    expect(response.body).toHaveProperty('fields');
    expect(connection.execute).toHaveBeenCalledWith(
      'INSERT INTO chat_completions (`role`, `message_content`) VALUES (?, ?)',
      ['user', 'Hello, world!']
    );
  });

  it('should return 400 for invalid data', async () => {
    connection.execute.mockRejectedValue(new Error('Invalid data'));

    const response = await request(app)
      .post('/messages')
      .send({ role: 'user' }) // Missing message_content
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});
