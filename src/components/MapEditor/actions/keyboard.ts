import keyboardJS from 'keyboardjs';
import { move, zoomIn, zoomOut } from './move';

export function initializeKeyboardEvents(){
    keyboardJS.bind('up', () => move(0, -1))
    keyboardJS.bind('down', () => move(0, +1))
    keyboardJS.bind('left', () => move(-1, 0))
    keyboardJS.bind('right', () => move(1, 0))
    keyboardJS.bind('w', () => move(0, -1))
    keyboardJS.bind('s', () => move(0, +1))
    keyboardJS.bind('a', () => move(-1, 0))
    keyboardJS.bind('d', () => move(1, 0))

    keyboardJS.bind('alt + up', zoomIn)
    keyboardJS.bind('alt + down', zoomOut)
    keyboardJS.bind('alt + w', zoomIn)
    keyboardJS.bind('alt + s', zoomOut)
}