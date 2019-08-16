export interface MapIndex {
    title: string
    mapId: string
}

export interface DataDirStatus {
    indices: MapIndex[]
    mapDataCounter: {[key: string]: number}
}

export interface UploadMapData {
    title: string
    body: MapBody
}

export interface MapBody {
    width: number;
    height: number;
    parts: {
        id: string
        path: string
    }[]
}

export interface CommitMeta {
    title: string
    author: string
    regionHash: string
    time: number
}

export interface Commit {
    title: string
    author: string
    regions: any[]
}

export interface ConfigFile {
    port: number
}