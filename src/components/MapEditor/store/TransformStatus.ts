import { TransformStatusSnapshot } from '../../../types/snapshot';
import { action, computed, observable } from 'mobx';
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

export default TransformStatus;