import { app, port, connection } from "./server.mjs";
import request from 'supertest'

describe('Server connections', ()=>{
    test('backend port', ()=>{
        expect(port).toBeGreaterThanOrEqual(0+1)
    })
    test('MySQL connection', ()=>{
        expect(connection).not.toBeNull()
    })
    test('app', ()=>{
        expect(app).not.toBeNull()
    })    
})

describe('Endpoints', ()=>{
    test('GET /messages', async ()=>{
        // normal test
        const res = await request(app).get('/messages')
        expect(res).not.toBeNull()
    })
})