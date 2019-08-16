import { observable, action } from 'mobx';
import { MapMeta } from '../../types/map';
class MapListStatus {
    @observable loaded: boolean = false
    @observable mapList: MapMeta[] = []

    @action setList(mapList: MapMeta[]){
        this.loaded = true
        this.mapList = mapList
    }
}

export const mapListStatus = new MapListStatus()