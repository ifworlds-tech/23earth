import { reaction } from 'mobx';
import { mapStatus } from '../store';
export interface Snapshotable<SnapShot> {
    importSnapshot(snap: SnapShot): void
    exportSnapshot(): SnapShot
    snapshotGeneration: number
}

export function registerSnapshot<SnapShot>(key: string, store: Snapshotable<SnapShot>){
    return reaction(() => store.snapshotGeneration, () => {
        saveSnapshot<SnapShot>(key, store)
    })
}

export function loadSnapshot<SnapShot>(key: string, store: Snapshotable<SnapShot>){
    if(localStorage[key  + `.${mapStatus.mapId}`]){
        const data = JSON.parse(localStorage[key  + `.${mapStatus.mapId}`]) as SnapShot
        store.importSnapshot(data)
        return true
    }
    return false
}

export function saveSnapshot<SnapShot>(key: string, store: Snapshotable<SnapShot>){
    localStorage[key + `.${mapStatus.mapId}`] = JSON.stringify(store.exportSnapshot())
}
