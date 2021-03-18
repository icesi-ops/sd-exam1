import express from 'express'
import {Request, Response} from 'express'

import Busboy from "busboy";
import * as path from "path";
import * as fs from "fs";
import * as env from 'env-var';

const df = require('node-df');
const util = require('util'); 
const real_df = util.promisify(df);


const storage: string = env.get('STORAGE').required().asString()

const router = express.Router()

router.get('/api/files', (req: Request, res: Response) => {
    return res.send([])
})

router.post('/api/upload', (req: Request, res: Response) => {
    const busboy = new Busboy({ headers: req.headers });

    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {

        // path to file upload
        const saveTo = path.join(storage, filename);

        file.pipe(fs.createWriteStream(saveTo));
    });

    busboy.on("finish", function () {
        res.status(200).json({ "message": "File uploaded successfully." });
    });
    req.pipe(busboy);
})

router.get('/api/availableStorage', async (req: Request, res: Response) => {
    try {
        const result: [any] = await real_df()
        const df = result.filter(item => item.mount === "/mnt/shared")[0]
        return res.status(200).send(JSON.stringify(df.available))
    } catch (error) {
        console.log(error)
    }
})

export { router as apiRouter }