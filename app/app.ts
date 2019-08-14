import express from 'express';
import bodyParser from 'body-parser';
import Path from 'path';
import Ajv from 'ajv'
import Crypto from 'crypto';
import fs from 'fs';
import moment from 'moment'
import {sortBy} from 'lodash'

const port = 3001

interface AppMapConfig {
    width: number;
    height: number;
    parts: {
        id: string
        path: string
    }[]
}

interface Commit {
    title: string
    author: string
    regions: any[]
}

interface CommitMeta {
    title: string
    author: string
    regionHash: string
    date: number
}

const snapshotSchemaAsync = fs.promises.readFile("../schema/UploadSnapshot.json").then(data => {
    return JSON.parse(data.toString("utf-8"))
})

const app = express()
app.use(bodyParser.json())

const ajv = new Ajv()

app.get("/api/map", (req, res) => {
    res.sendFile(Path.resolve('../config/map.json'))
})

const DataIndicesPath = "../data/indices"
const DataRegionPath = "../data/regions"

app.post("/api/push", async (req, res) => {
    const schema = await snapshotSchemaAsync
    if(!ajv.validate(schema, req.body)){
        res.send({message: ajv.errorsText, code: 2})
    }else{
        const data = req.body as Commit
        const regionData = JSON.stringify(data.regions)
        const hash = Crypto.createHmac('sha256', "S.H.I.T.")
            .update(regionData)
            .digest('hex');
        await fs.promises.writeFile(Path.resolve(DataRegionPath, `${hash}.json`), regionData)
        const time = moment()
        const meta: CommitMeta = {
            title: data.title,
            author: data.author,
            regionHash: hash,
            date: time.toDate().getTime()
        }
        await fs.promises.writeFile(Path.resolve(DataIndicesPath, `${time.toDate().getTime()}.json`), JSON.stringify(meta))
        res.send({message: '成功', code: 0})
    }
})

app.get("/api/list", async (req, res) => {
    const files = await fs.promises.readdir("../data/indices")
    const data: CommitMeta[] = await Promise.all(sortBy(files.filter(x => x.endsWith(".json")), x => {
        const [d, _] = x.split(".")
        return -parseInt(d)
    }).map(async fp =>
        JSON.parse((await fs.promises.readFile(Path.resolve(DataIndicesPath, fp))).toString('utf-8'))
    ))
    res.json(data)
})

app.get("/api/pull/:hash", async (req, res) => {
    const hash = req.params['hash'] || ""
    if(!hash.match(/^\w+$/)){
        res.json({
            code: 2,
            message: '非法格式'
        })
    }
    const fp = Path.resolve(DataRegionPath, `${hash}.json`)
    fs.exists(fp, exists => {
        if(exists){
            res.sendFile(fp)
        }else{
            res.json({
                code: 3,
                message: '内容不存在'
            })
        }
    })
})

console.log(`Running on port: ${port}`)
app.listen(port, '0.0.0.0')