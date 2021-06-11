import express = require("express");
import { createConnection } from 'typeorm'
import { router } from './routes'
import "reflect-metadata";

createConnection()

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true })) 

app.use(router)

app.listen(3333, () => console.log('Server is running on http://localhost:3333'))
