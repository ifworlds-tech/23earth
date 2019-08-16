import { MapStatusSnapshot } from '../../../types/snapshot';
import { action, observable, computed } from 'mobx';
import { RegionInfo } from '../../../types/region';
import { MapData, MapDataPart } from '../../../types/map';
import {find, union, concat} from 'lodash';

class MapStatus{
    @observable mapId: string = ""
    @observable loaded: boolean = false
    @observable listenerRegistered: boolean = false
    @observable mapData: MapData = {
        width: 0,
        height: 0,
        parts: []
    }
    @observable mapDataIndex: Map<string, MapDataPart> = new Map()
    @observable currentRegionId: string | null = null
    @observable regions: RegionInfo[] = []
    @observable snapshotGeneration: number = 0

    @action setMapId(mapId: string){
        this.mapId = mapId
        this.loaded = false
    }

    @action finishRegisteringListener(){
        this.listenerRegistered = true
    }

    getPartById(id: string){
        const target = this.mapDataIndex.get(id)
        if(!target){
            throw new Error(`Invalid part id: ${id}`)
        }
        return target
    }

    @computed get currentRegion(): null | RegionInfo{
        const id = this.currentRegionId
        if(!id) return null
        const target = find(this.regions, {id})
        return target ? target : null
    }

    @action mergeRegions(regions: RegionInfo[]){
        for(const reg of regions){
            const target = find(this.regions, {id: reg.id})
            if(target){
                const newParts = union(target.parts, reg.parts)
                Object.assign(target, {parts: newParts})
            }else{
                this.regions.push(reg)
            }
        }
        this.snapshotGeneration ++
    }

    @action reset(){
        this.currentRegionId = null
        this.regions = []
        this.snapshotGeneration++
    }

    @action setMapData(mapData: MapData){
        this.mapData = mapData
        this.mapDataIndex = new Map()
        for(const p of mapData.parts){
            this.mapDataIndex.set(p.id, p)
        }
        this.loaded = true
    }
    
    @action addPart(partId: string){
        const target = this.currentRegion
        if(target !== null && target.parts.indexOf(partId) === -1){
            target.parts = union(target.parts, [partId])
        }
        this.snapshotGeneration++
    }

    @action deletePart(id: string, regionId: string){
        const target = find(this.regions, {id: regionId})
        if(!target){
            throw new Error(`No such region id: ${regionId}`)
        }
        if(regionId === this.currentRegionId){
            target.parts = target.parts.filter(p => p !== id)
        }
        this.snapshotGeneration++
    }

    @action updateRegion(region: RegionInfo){
        const target = find(this.regions, {id: region.id})
        if(!!target){
            Object.assign(target, region)
            this.setCurrentRegion(target)
        }else{
            this.regions.push(region)
            this.setCurrentRegion(region)
        }
        this.snapshotGeneration++
    }

    @action deleteRegion(regionId: string){
        if(this.currentRegionId  === regionId){
            this.currentRegionId = null
        }
        this.regions = this.regions.filter(r => r.id !== regionId)
        this.snapshotGeneration++
    }

    @action setCurrentRegion(region: RegionInfo){
        this.currentRegionId = region.id
        this.snapshotGeneration++
    }

    @action setCurrentRegionById(id: string){
        const target = find(this.regions, {id})
        if(!target){
            throw new Error(`Region id not found: ${id}`)
        }
        this.setCurrentRegion(target)
        this.snapshotGeneration++
    }

    @action resetCurrentRegion(){
        this.currentRegionId = null
        this.snapshotGeneration++
    }

    @action importSnapshot(snap: MapStatusSnapshot){
        this.regions = snap.regions
        this.currentRegionId = snap.currentRegionId
    }

    exportSnapshot(): MapStatusSnapshot{
        return {
            regions: this.regions,
            currentRegionId: this.currentRegionId
        }
    }

    snapshotKey(){
        return [
            this.currentRegionId,
            ...concat([], ...this.regions.map(reg => [
                reg.id,
                reg.name,
                reg.description,
                ...reg.parts
            ]))
        ]
    }
}

export default MapStatus