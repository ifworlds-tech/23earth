import { RegionInfo } from './region';

export interface MapStatusSnapshot {
    currentRegionId: string | null
    regions: RegionInfo[]
}

export interface TransformStatusSnapshot {
    centerX: number
    centerY: number
    zoom: number
}

export interface AuthorInfoSnapshot {
    title: string
    author: string
}

export interface UploadSnapshot {
    title: string
    author: string
    regions: RegionInfo[]
}

export interface OnlineItemMeta {
    title: string
    author: string
    time: number
    regionHash: string
}