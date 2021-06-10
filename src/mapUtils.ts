import {MapData, MapMeta} from './types/map'

export const mapIndexLoaders: (() => Promise<MapMeta>)[] = [
    async () => (await import('./maps/indices/0.json')).default
]

export const mapDataLoaders: {[key: string]: () => Promise<MapData>} = {
    world: async () => (await import('./maps/body/world.json')).default
}
