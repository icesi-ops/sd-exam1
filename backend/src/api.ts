import express from 'express'
import {Request, Response} from 'express'

const router = express.Router()

router.get('/api/files', (req: Request, res: Response) => {
    return res.send([])
})

router.post('/api/upload', (req: Request, res: Response) => {
    return res.sendStatus(200)
})

router.get('/api/availableStorage', (req: Request, res: Response) => {
    return res.send('Hello world')
})

export { router as apiRouter }