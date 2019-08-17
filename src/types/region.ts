export interface RegionInfo {
    id: string
    name: string
    description: string
    color: string
    parts: string[]
    cities?: CityInfo[]
}

export interface CityInfo {
    name: string
    x: number
    y: number
}