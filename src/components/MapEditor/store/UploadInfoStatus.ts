import { observable, action } from 'mobx';
import { AuthorInfoSnapshot } from '../../../types/snapshot';
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

export default UploadInfoStatus