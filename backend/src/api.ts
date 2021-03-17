import express from 'express'
import {Request, Response} from 'express'

import * as Busboy from "busboy";
import * as path from "path";
import * as fs from "fs";

const df = require('node-df');
const util = require('util'); 
const real_df = util.promisify(df);

const router = express.Router()

router.get('/api/files', (req: Request, res: Response) => {
    return res.send([])
})

router.post('/api/upload', (req: Request, res: Response) => {
    return res.sendStatus(200)
})

router.get('/api/availableStorage', async (req: Request, res: Response) => {
    const result: [any] = await real_df()
    const available = result.filter(item => item.filesystem === "localhost:/gv0")[0].available
    return res.send(available)
})

export { router as apiRouter }