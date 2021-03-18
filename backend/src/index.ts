import express from 'express'
import { json } from 'body-parser'
import { apiRouter } from './api'

import * as env from 'env-var';

import mongoose from 'mongoose';

const app = express()
app.use(json())
app.use(apiRouter)

const db_ip: string = env.get('DB_IP').required().asString()
console.log('mongodb://'+db_ip+':27017/files')
mongoose.connect('mongodb://'+db_ip+':27017/files',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify:true,
    useUnifiedTopology: true
}, () => {
    console.log('connected to db')
})

app.listen(3000, () => {
    console.log('server is listening on port 3000')
})