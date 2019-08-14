import { transformStatus } from '../store';
const ZoomStep = 2
const MoveStep = 100

export function zoomIn(){
    transformStatus.setZoom(transformStatus.zoom * ZoomStep)
}

export function zoomOut(){
    transformStatus.setZoom(transformStatus.zoom / ZoomStep)
}

export function move(dx: number, dy: number){
    const rdx = MoveStep * dx / transformStatus.zoom
    const rdy = MoveStep * dy / transformStatus.zoom
    transformStatus.setPos(
        transformStatus.centerX + rdx,
        transformStatus.centerY + rdy
    )
}