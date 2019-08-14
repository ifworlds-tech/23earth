export interface MapDataPart {
    id: string
    path: string
}

export interface MapData {
    width: number
    height: number
    parts: MapDataPart[]
}

export interface FilledPart {
    id: string
    path: string
    color: string
    regionId: string
}
