import { action, computed, observable } from 'mobx';
import { RegionInfo } from '../../../types/region';
class NewRegionStatus{
    @observable id: string = ""
    @observable name: string = ""
    @observable description: string = ""
    @observable color: string = "#ff0000"
    @observable parts: string[] = []
    @observable mode: "disabled" | "edit" | "create" = "disabled"

    @computed get regionInfo(): RegionInfo {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            color: this.color,
            parts: this.parts
        }
    }

    @action reset(){
        this.id = ""
        this.name = ""
        this.description = ""
        this.color = "#ff0000"
        this.parts = []
    }

    @action hide(){
        this.reset()
        this.mode = 'disabled'
    }

    @action create(){
        this.reset()
        this.mode = 'create'
    }

    @action edit(region: RegionInfo){
        this.id = region.id
        this.name = region.name
        this.description = region.description
        this.color = region.color
        this.parts = region.parts
        this.mode = 'edit'
    }

    @action setName(name: string){
        this.name = name
        this.id = name
        // if(this.mode === 'create'){
        //     this.id = name
        // }
    }

    @action setDescription(desc: string){
        this.description = desc
    }

    @action setColor(color: string){
        this.color = color
    }
}

export default NewRegionStatus