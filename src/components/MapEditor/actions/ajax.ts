import { notification } from 'antd';
import { mapDataLoaders } from '../../../mapUtils';
import { OnlineItemMeta, UploadSnapshot } from '../../../types/snapshot';
import { mapStatus, onlineListStatus } from '../store';

export async function loadMapData(mapId: string){
    mapStatus.setMapId(mapId)
    const data = await mapDataLoaders[mapId]()
    mapStatus.setMapData(data)
    return data
}

export interface CommitListItem {
    mid: string
    cid: number
}

const LOCAL_COMMIT_LIST_PREFIX = 'ifworlds.map.local_commit_list.';
const LOCAL_COMMIT_PREFIX = 'ifworlds.map.data.';

function getLocalCommitList(mapId: string): CommitListItem[] {
    const data = localStorage[LOCAL_COMMIT_LIST_PREFIX + mapId]
    return data ? JSON.parse(data) : []
}

function appendLocalCommitList(newItem: CommitListItem) {
    const data = getLocalCommitList(newItem.mid)
    data.push(newItem)
    localStorage[LOCAL_COMMIT_LIST_PREFIX + newItem.mid] = JSON.stringify(data)
}

function saveMapCommit(mapId: string, snap: UploadSnapshot): CommitListItem {
    const cid = new Date().getTime()
    const mid = mapId
    localStorage[`${LOCAL_COMMIT_PREFIX}${cid}.${mid}`] = JSON.stringify(snap)
    return {cid, mid}
}

function loadMapCommit({cid, mid}: CommitListItem): UploadSnapshot{
    const data = JSON.parse(localStorage[`${LOCAL_COMMIT_PREFIX}${cid}.${mid}`])
    return data
}

export async function pushMap(snap: UploadSnapshot){
    const item = saveMapCommit(mapStatus.mapId, snap)
    appendLocalCommitList(item)
    notification.success({message: '已保存'})
}

export async function showOnlineItems(){
    onlineListStatus.start()
    const res = getLocalCommitList(mapStatus.mapId).map(item => {
        const snap = loadMapCommit(item)
        const data: OnlineItemMeta = {
            title: snap.title,
            author: snap.author,
            time: item.cid,
            regionHash: `${item.mid}:${item.cid}`
        }
        return data
    })
    onlineListStatus.finish(res)
}

export async function pullAndMerge(regionHash: string){
    const [mid, cidS] = regionHash.split(":")
    const cid = parseInt(cidS)
    const res = loadMapCommit({cid, mid}).regions
    if(res instanceof Array){
        mapStatus.mergeRegions(res)
        notification.success({
            type: 'success',
            message: '成功合并'
        })
    }else{
        notification.error({message: "未知错误"})
    }
}