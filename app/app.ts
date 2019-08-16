import express from 'express';
import bodyParser from 'body-parser';
import {validCommit, isHashString} from './validation'
import { Commit } from './typs';
import { saveCommit, initializeDataDir, getRegionFilename, getCommitMetaList, getMapBodyFilename } from './dataDir';
import CONFIG from './config'

const app = express()
app.use(bodyParser.json())

const dataStatusAsync = initializeDataDir()

app.get("/api/map/list", async (req, res) => {
    res.json((await dataStatusAsync).indices)
})

app.get("/api/map/data/:mapId", async (req, res) => {
    const mapId: string = req.params['mapId']
    if(!isHashString(mapId)){
        throw "SHIT"
    }
    res.sendFile(getMapBodyFilename(mapId))
})

app.post("/api/commit/push/:mapId", async (req, res) => {
    const data: Commit = req.body
    const mapId = req.params['mapId']
    const err = await validCommit(data)
    if(err){
        res.send({message: err, code: 2})
    }else if(!isHashString(mapId)){
        throw "SHIT"
    }else{
        await saveCommit(await dataStatusAsync, mapId, data)
        res.send({message: '成功', code: 0})
    }
})

app.get("/api/commit/list/:mapId", async (req, res) => {
    const mapId: string = req.params['mapId']
    if(!isHashString(mapId)){
        throw "SHIT"
    }
    res.json(await getCommitMetaList(await dataStatusAsync, mapId))
})

app.get("/api/commit/pull/:mapId/:hash", async (req, res) => {
    const hash = req.params['hash'] || ""
    const mapId = req.params['mapId'] || ""
    if(!isHashString(hash) || !isHashString(mapId)){
        res.json({
            code: 2,
            message: '非法格式'
        })
    }
    res.sendFile(getRegionFilename(mapId, hash))
})

console.log(`Running on port: ${CONFIG.port}`)
app.listen(CONFIG.port, '0.0.0.0')