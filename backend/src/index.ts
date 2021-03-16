import express from 'express'
import { json } from 'body-parser'
import { apiRouter } from './api'

const app = express()
app.use(json())
app.use(apiRouter)

app.listen(3000, () => {
    console.log('server is listening on port 3000')
})