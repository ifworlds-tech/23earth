import {action, observable, computed} from 'mobx';
import { MapData, MapDataPart, FilledPart } from '../../types/map';
import { RegionInfo } from '../../types/region';
import {find, union, concat} from 'lodash';
import { MapStatusSnapshot, TransformStatusSnapshot, AuthorInfoSnapshot, OnlineItemMeta } from '../../types/snapshot';

class MapStatus{
    @observable loaded: boolean = false
    @observable mapData: MapData = {
        width: 0,
        height: 0,
        parts: []
    }
    @observable mapDataIndex: Map<string, MapDataPart> = new Map()
    @observable currentRegionId: string | null = null
    @observable regions: RegionInfo[] = []
    @observable snapshotGeneration: number = 0

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


class TransformStatus{
    @observable zoom: number = 1
    @observable centerX: number = 0
    @observable centerY: number = 0
    @observable mapWidth: number = 0
    @observable mapHeight: number = 0
    @observable windowWidth: number = 0
    @observable windowHeight: number = 0
    @observable snapshotGeneration: number = 0

    @action setSize(
        mapWidth: number, 
        mapHeight: number,
        windowWidth: number, 
        windowHeight: number,
    ){
        this.mapWidth = mapWidth
        this.mapHeight = mapHeight
        this.windowWidth = windowWidth
        this.windowHeight = windowHeight
    }

    @action initStatus(){
        this.zoom = Math.max(
            this.windowWidth / this.mapWidth,
            this.windowHeight / this.mapHeight
        )
        this.centerX = this.mapWidth / 2
        this.centerY = this.mapHeight / 2
        this.snapshotGeneration ++
    }

    @action setZoom(zoom: number){
        const minZoom = Math.max(
            this.windowWidth / this.mapWidth,
            this.windowHeight / this.mapHeight
        )
        if(zoom >= minZoom){
            const ww = this.windowWidth / zoom
            const wh = this.windowHeight / zoom
            if(this.centerX < ww/2){
                this.centerX = ww/2
            }else if(this.centerX > this.mapWidth - ww/2){
                this.centerX = this.mapWidth - ww/2
            }
            if(this.centerY < wh/2){
                this.centerY = wh/2
            }else if(this.centerY > this.mapHeight - wh/2){
                this.centerY = this.mapHeight - wh/2
            }
            this.zoom = zoom
            this.snapshotGeneration++
        }
    }
    @action setPos(x: number, y: number){
        const ww = this.windowWidth / this.zoom
        const wh = this.windowHeight / this.zoom
        if(x >= ww/2 && x + ww/2 <= this.mapWidth){
            this.centerX = x
        }else if(x !== this.centerX){
            const l = ww/2
            const r = this.mapWidth - ww/2
            this.centerX = Math.abs(l - x) > Math.abs(r - x) ? r : l;
        }
        if(y >= wh/2 && y + wh/2 <= this.mapHeight){
            this.centerY = y;
        }else if(y !== this.centerY){
            const t = wh/2
            const b = this.mapHeight - wh/2
            this.centerY = Math.abs(t - y) > Math.abs(b - y) ? b : t;
        }
        this.snapshotGeneration++
    }

    @computed get viewBox(){
        const w = this.windowWidth / this.zoom
        const h = this.windowHeight / this.zoom
        const x = this.centerX - w/2
        const y = this.centerY - h/2
        return `${x} ${y} ${w} ${h}`
    }

    @action importSnapshot(snap: TransformStatusSnapshot){
        this.zoom = snap.zoom
        this.centerX = snap.centerX
        this.centerY = snap.centerY
    }

    exportSnapshot(): TransformStatusSnapshot{
        return {
            centerX: this.centerX,
            centerY: this.centerY,
            zoom: this.zoom
        }
    }
}


class NewRegionStatus{
    @observable id: string = ""
    @observable name: string = ""
    @observable description: string = ""
    @observable color: string = "#ff0000"
    @observable parts: string[] = []
    @observable mode: "disabled" | "edit" | "create" = "disabled"

    @computed get regionInfo(): RegionInfo {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            color: this.color,
            parts: this.parts
        }
    }

    @action reset(){
        this.id = ""
        this.name = ""
        this.description = ""
        this.color = "#ff0000"
        this.parts = []
    }

    @action hide(){
        this.reset()
        this.mode = 'disabled'
    }

    @action create(){
        this.reset()
        this.mode = 'create'
    }

    @action edit(region: RegionInfo){
        this.id = region.id
        this.name = region.name
        this.description = region.description
        this.color = region.color
        this.parts = region.parts
        this.mode = 'edit'
    }

    @action setName(name: string){
        this.name = name
        if(this.mode === 'create'){
            this.id = name
        }
    }

    @action setDescription(desc: string){
        this.description = desc
    }

    @action setColor(color: string){
        this.color = color
    }
}

class UploadInfoStatus{
    @observable title: string = ""
    @observable author: string = ""
    @observable visible: boolean = false
    @observable snapshotGeneration: number = 0

    @action show(){
        this.visible = true
    }

    @action hide(){
        this.visible = false
    }

    @action setTitle(title: string){
        this.title = title
        this.snapshotGeneration ++
    }

    @action setAuthor(author: string){
        this.author = author
        this.snapshotGeneration ++
    }

    @action importSnapshot(snap: AuthorInfoSnapshot){
        this.title = snap.title
        this.author = snap.author
        this.snapshotGeneration ++
    }

    exportSnapshot(): AuthorInfoSnapshot{
        return {
            author: this.author,
            title: this.title
        }
    }
}

class OnlineListStatus {
    @observable onlineList: OnlineItemMeta[] = []
    @observable loading: boolean = true
    @observable visible: boolean = false
    @action start(){
        this.onlineList = []
        this.loading = true
        this.visible = true
    }
    @action finish(onlineList: OnlineItemMeta[]){
        this.onlineList=onlineList
        this.loading = false
    }
    @action hide(){
        this.visible = false
    }
}

export const mapStatus = new MapStatus()
export const newRegionStatus = new NewRegionStatus()
export const transformStatus = new TransformStatus()
export const uploadInfoStatus = new UploadInfoStatus()
export const onlineListStatus = new OnlineListStatus()