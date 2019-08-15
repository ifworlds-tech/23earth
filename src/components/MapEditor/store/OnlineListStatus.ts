import { observable, action } from 'mobx';
import { OnlineItemMeta } from '../../../types/snapshot';
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

export default OnlineListStatus;