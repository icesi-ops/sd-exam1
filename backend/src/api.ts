import express from 'express'
import {Request, Response} from 'express'

const router = express.Router()

router.get('/api/echo', (req: Request, res: Response) => {
    return res.send('Hello world')
})

export { router as apiRouter }