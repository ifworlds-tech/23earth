import axios from 'axios';
import { MapData } from '../../../types/map';
import { mapStatus, onlineListStatus } from '../store';
import { UploadSnapshot, OnlineItemMeta } from '../../../types/snapshot';
import { notification } from 'antd';
import { RegionInfo } from '../../../types/region';

export async function loadMapData(){
    const data = await axios.get<MapData>("/api/map").then(r => r.data)
    mapStatus.setMapData(data)
    return data
}


export async function pushMap(snap: UploadSnapshot){
    const res = await axios.post<{code: number, message: string}>("/api/push", snap)
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
    const res = await axios.get<OnlineItemMeta[]>("/api/list").then(r => r.data)
    onlineListStatus.finish(res)
}

interface Result<T> {
    code: number
    message: string
    data: T
}

export async function pullAndMerge(regionHash: string){
    const res = await axios.get<Result<RegionInfo[]>>(`/api/pull/${regionHash}`).then(res => res.data)
    if(res.code == 0){
        mapStatus.mergeRegions(res.data)
        notification.success({
            type: 'success',
            message: '成功合并'
        })
    }else{
        notification.error({message: res.message})
    }
}