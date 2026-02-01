import { app, port, connection } from "./server.mjs";

describe('Test Suite for server connections', ()=>{
    test('port', ()=>{
        expect(port).toBeGreaterThanOrEqual(0+1)
    })
})