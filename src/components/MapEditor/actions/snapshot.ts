import { reaction } from 'mobx';
export interface Snapshotable<SnapShot> {
    importSnapshot(snap: SnapShot): void
    exportSnapshot(): SnapShot
    snapshotGeneration: number
}

export function registerSnapshot<SnapShot>(key: string, store: Snapshotable<SnapShot>){
    reaction(() => store.snapshotGeneration, () => {
        saveSnapshot<SnapShot>(key, store)
    })
}

export function loadSnapshot<SnapShot>(key: string, store: Snapshotable<SnapShot>){
    if(localStorage[key]){
        const data = JSON.parse(localStorage[key]) as SnapShot
        store.importSnapshot(data)
    }
    return !!localStorage[key]
}

export function saveSnapshot<SnapShot>(key: string, store: Snapshotable<SnapShot>){
    localStorage[key] = JSON.stringify(store.exportSnapshot())
}
