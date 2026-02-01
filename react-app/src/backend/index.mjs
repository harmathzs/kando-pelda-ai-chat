import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())



const port = process?.env?.PORT || 3333
app.listen(port, (error)=>{
    if (error) console.warn(error)
    else console.log('Backend runs at port ', port)
})
