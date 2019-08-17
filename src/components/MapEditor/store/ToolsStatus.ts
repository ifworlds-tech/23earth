import { observable, action } from 'mobx';
import { RegionContextMenuStatus } from '../../../types/menu';
export type PaintToolMode = "click" | "swipe" | "erase"

class ToolsStatus {
    @observable panelVisible = false
    @observable paintMode: PaintToolMode = 'click'
    @observable contextMenu: null | RegionContextMenuStatus = null

    @action showPanel(){
        this.panelVisible = true
    }
    @action hidePanel(){
        this.panelVisible = false
    }

    @action setPaintMode(paintMode: PaintToolMode){
        this.paintMode = paintMode
    }

    @action resetMenu(){
        this.contextMenu = null
    }

    @action showRegionMenu(regionId: string, x: number, y: number){
        this.contextMenu = {
            type: 'region',
            x, y, regionId
        }
    }
}

export default ToolsStatus;