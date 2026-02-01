/** backend.test.mjs */
import { vi } from 'vitest'
//import { app, port, connection } from "./server.mjs";
import request from 'supertest'

// Mock module
vi.mock('./server.mjs', () => {
  return {
    app: {}, // Provide a mock for app
    port: 3333, // Provide a mock for port
    connection: {
      execute: vi.fn()
    }
  };
});

describe('Server connections', ()=>{
    test('backend port', async ()=>{
        const {app, port, connection} = await import('./server.mjs')
        expect(port).toBeGreaterThanOrEqual(0+1)
    })
    test('MySQL connection', async ()=>{
        const {app, port, connection} = await import('./server.mjs')
        expect(connection).not.toBeNull()
    })
    test('app', async ()=>{
        const {app, port, connection} = await import('./server.mjs')
        expect(app).not.toBeNull()
    })    
})

describe('Raw test endpoints', ()=>{
    test('GET /messages', async ()=>{
        // normal test
        const {app, port, connection} = await import('./server.mjs')
        const res = await request(app).get('/messages')
        expect(res).not.toBeNull()
    })
})



describe('POST /messages', () => {
  beforeEach(() => {
    // Clear all instances and calls to constructor and all methods:
    // TODO - jest.clearAllMocks();
  });

  it('should insert a message with valid data', async () => {
    // Mock the database response
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
    
    const response = await request(app)
      .post('/messages')
      .send({ role: 'user' }) // Missing message_content
      .expect(400);

    expect(response.body).toHaveProperty('error');
  });
});