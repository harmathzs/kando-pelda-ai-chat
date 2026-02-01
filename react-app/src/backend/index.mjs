import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'

export const app = express()

app.use(cors())
app.use(express.json())



export const port = process?.env?.PORT || 3333
app.listen(port, (error)=>{
    if (error) console.warn(error)
    else console.log('Backend runs at port ', port)
})
