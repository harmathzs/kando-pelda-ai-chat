/** server contains endpoint definitions, index listens */
/* test this and not index.mjs! */
import express from 'express'
import cors from 'cors'
import mysql from 'mysql2'

export const app = express()

app.use(cors())
app.use(express.json())



export const port = process?.env?.PORT || 3333
