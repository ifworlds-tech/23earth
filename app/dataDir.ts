import fs from 'fs';
import Path from 'path';
import { CommitMeta, Commit, MapIndex, DataDirStatus } from './typs';

import Crypto from 'crypto';
import moment from 'moment'
import { UploadMapData } from '../src/types/snapshot';

const MapIndicesDir = '../maps/indices'
const MapBodyDir = '../maps/body'
const DataDir = '../data'

async function readJsonData<T>(fp: string): Promise<T>{
    const blob = await fs.promises.readFile(fp)
    return JSON.parse(blob.toString("utf-8"))
}

async function initializeMapDataDir(mapId: string){
    await fs.promises.mkdir(Path.resolve(DataDir, mapId))
    await fs.promises.mkdir(Path.resolve(DataDir, mapId, 'commits'))
    await fs.promises.mkdir(Path.resolve(DataDir, mapId, 'regions'))
}

export async function initializeDataDir(): Promise<DataDirStatus>{
    const indices = await Promise.all((await fs.promises.readdir(MapIndicesDir))
        .map(async fp => await readJsonData(Path.resolve(MapIndicesDir, fp)) as MapIndex))
    if(!fs.existsSync(DataDir)){
        await fs.promises.mkdir(DataDir)
    }
    const mapDataCounter: {[key: string]: number} = {}
    for(const idx of indices){
        if(!fs.existsSync(Path.resolve(DataDir, idx.mapId))){
            await initializeMapDataDir(idx.mapId)
        }
        mapDataCounter[idx.mapId] = (
            await fs.promises.readdir(
                Path.resolve(DataDir, idx.mapId, 'commits')
            )).length
    }
    return {indices, mapDataCounter}
}

export function getMapBodyFilename(bodyId: string){
    return Path.resolve(MapBodyDir, `${bodyId}.json`)
}

export function getRegionFilename(mapId: string, regionHash: string){
    return Path.resolve(DataDir, mapId, 'regions', `${regionHash}.json`)
}

export async function getCommitMetaList(status: DataDirStatus, mapId: string): Promise<CommitMeta[]>{
    const promises: Promise<CommitMeta>[] = []
    for(let i=status.mapDataCounter[mapId]-1; i>=0; i--){
        promises.push(getCommitMeta(mapId, i))
    }
    return await Promise.all(promises)
}

export async function getCommitMeta(mapId: string, commitId: number): Promise<CommitMeta> {
    const fp = Path.resolve(DataDir, mapId, 'commits', `${commitId}.json`)
    return readJsonData<CommitMeta>(fp)
}

export async function saveCommit(dirStatus: DataDirStatus, mapId: string, commit: Commit){
    const regionData = JSON.stringify(commit.regions)
    const hash = Crypto.createHmac('sha256', "S.H.I.T.")
        .update(regionData)
        .digest('hex');
    const regionPath = Path.resolve(DataDir, mapId, 'regions', `${hash}.json`)
    if(!fs.existsSync(regionPath)){
        await fs.promises.writeFile(regionPath, regionData)
    }
    const time = moment()
    const meta: CommitMeta = {
        title: commit.title,
        author: commit.author,
        regionHash: hash,
        time: time.toDate().getTime()
    }
    await fs.promises.writeFile(Path.resolve(DataDir, mapId, 'commits', `${dirStatus.mapDataCounter[mapId]++}.json`), JSON.stringify(meta))
}

// export async function saveMap(dirStatus: DataDirStatus, map: UploadMapData){
//     dirStatus.indices
// }