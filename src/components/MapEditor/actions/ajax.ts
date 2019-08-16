import axios from 'axios';
import { MapData } from '../../../types/map';
import { mapStatus, onlineListStatus } from '../store';
import { UploadSnapshot, OnlineItemMeta } from '../../../types/snapshot';
import { notification } from 'antd';
import { RegionInfo } from '../../../types/region';

export async function loadMapData(mapId: string){
    mapStatus.setMapId(mapId)
    const data = await axios.get<MapData>(`/api/map/data/${mapId}`).then(r => r.data)
    mapStatus.setMapData(data)
    return data
}


export async function pushMap(snap: UploadSnapshot){
    const res = await axios.post<{code: number, message: string}>(`/api/commit/push/${mapStatus.mapId}`, snap)
    const {code, message} = await res.data
    if(code === 0){
        notification.success({
            message
        })
    }else{
        notification.error({
            message
        })
    }
}

export async function showOnlineItems(){
    onlineListStatus.start()
    const res = await axios.get<OnlineItemMeta[]>(`/api/commit/list/${mapStatus.mapId}`).then(r => r.data)
    onlineListStatus.finish(res)
}

interface Result<T> {
    code: number
    message: string
    data: T
}

export async function pullAndMerge(regionHash: string){
    const res = await axios.get<RegionInfo[] | {code: number, message: string}>(`/api/commit/pull/${mapStatus.mapId}/${regionHash}`).then(res => res.data)
    if(res instanceof Array){
        mapStatus.mergeRegions(res)
        notification.success({
            type: 'success',
            message: '成功合并'
        })
    }else{
        notification.error({message: res.message})
    }
}