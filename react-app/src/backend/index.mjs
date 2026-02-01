import { app } from "./server.mjs"
import { port } from "./server.mjs"

app.listen(port, (error)=>{
    if (error) console.warn(error)
    else console.log('Backend runs at port ', port)
})
