import { observable, action } from 'mobx';
export type PaintToolMode = "click" | "swipe" | "erase"

class ToolsStatus {
    @observable panelVisible = false
    @observable paintMode: PaintToolMode = 'click'
    @action showPanel(){
        this.panelVisible = true
    }
    @action hidePanel(){
        this.panelVisible = false
    }

    @action setPaintMode(paintMode: PaintToolMode){
        this.paintMode = paintMode
    }
}

export default ToolsStatus;