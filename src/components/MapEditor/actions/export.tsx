import React from 'react';
import { mapStatus } from '../store';
import { MapContent } from '../mapContent';
import ReactDOMServer from 'react-dom/server';
import moment from 'moment'
import domToImg from 'dom-to-image'
import { EEXIST } from 'constants';

export async function renderCurrentMap(scale: number = 1, borderVisible: boolean = false){
    const map = (
        <svg
            width={mapStatus.mapData.width * scale}
            height={mapStatus.mapData.height * scale}
            viewBox={`0 0 ${mapStatus.mapData.width} ${mapStatus.mapData.height}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <MapContent
                background={mapStatus.mapData.parts}
                regions={mapStatus.regions}
                generation={0}
                borderVisible={borderVisible}
                getPartById={id => mapStatus.getPartById(id)}
            />
        </svg>)
        return ReactDOMServer.renderToString(map)
}

export async function downloadText(type: string, content: string, filename: string){
    const blob = new Blob([content], {type})
    await downloadBlob(blob, filename)
}

export async function downloadBlob(blob: Blob, filename: string){
    const url = window.URL.createObjectURL(blob);
    await downloadDataUrl(url, filename)
    
}

export async function downloadDataUrl(dataUrl: string, filename: string){
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename
    a.click();
}

export async function exportCurrentMap(){
    const html = await renderCurrentMap()
    downloadText("image/svg+xml", html, `23earth_${moment().format("YYYY-MM-DD_hh:mm:ss")}.svg`)
}

export async function exportCurrentMapAsPng(height: number){
    const scale = height / mapStatus.mapData.height
    const svg = await renderCurrentMap(scale, false)
    const ele = document.createElement("div")
    ele.innerHTML=svg
    ele.style.left = `${document.body.clientWidth}px`
    ele.style.top = `${document.body.clientHeight}px`
    ele.style.width = `${mapStatus.mapData.width * scale}px`
    ele.style.height = `${height}px`
    ele.style.backgroundColor='white'
    document.body.appendChild(ele)
    const data = await domToImg.toPng(ele)
    ele.remove()
    downloadDataUrl(data, `23earth_${moment().format("YYYY-MM-DD_hh:mm:ss")}.png`)
}