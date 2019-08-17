import { mapStatus, transformStatus, uploadInfoStatus } from '../store';
import { registerSnapshot, loadSnapshot } from './snapshot';
import { initializeKeyboardEvents } from './keyboard';
import { loadMapData } from './ajax';

const SNAPSHOT_MAP_KEY = '23earth.snapshot.map'
const SNAPSHOT_TRANSFORM_KEY = '23earth.snapshot.pos'
const SNAPSHOT_UPLOAD_KEY = '23earth.snapshot.upload'

export async function initializeMap(mapId: string){
    const dataMap = await loadMapData(mapId)
    loadSnapshot(SNAPSHOT_MAP_KEY, mapStatus)
    transformStatus.setSize(
        dataMap.width, dataMap.height, 
        document.body.clientWidth, document.body.clientHeight
    )
    if(!loadSnapshot(SNAPSHOT_TRANSFORM_KEY, transformStatus)){
        transformStatus.initStatus()
    }
    loadSnapshot(SNAPSHOT_UPLOAD_KEY, uploadInfoStatus)
    return registerListener()
}

export function registerListener(){
    if(!mapStatus.listenerRegistered){
        initializeKeyboardEvents()
        mapStatus.finishRegisteringListener()
    }
    const reg1 = registerSnapshot(SNAPSHOT_MAP_KEY, mapStatus)
    const reg2 = registerSnapshot(SNAPSHOT_TRANSFORM_KEY, transformStatus)
    const reg3 = registerSnapshot(SNAPSHOT_UPLOAD_KEY, uploadInfoStatus)
    return () => {
        reg1()
        reg2()
        reg3()
    }
}