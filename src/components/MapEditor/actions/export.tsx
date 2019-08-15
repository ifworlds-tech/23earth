import React from 'react';
import { mapStatus } from '../store';
import { MapContent } from '../mapContent';
import ReactDOMServer from 'react-dom/server';
import moment from 'moment'

export async function renderCurrentMap(){
    const map = (
        <svg
            width={mapStatus.mapData.width}
            height={mapStatus.mapData.height}
            viewBox={`0 0 ${mapStatus.mapData.width} ${mapStatus.mapData.height}`}
            xmlns="http://www.w3.org/2000/svg"
        >
            <MapContent
                background={mapStatus.mapData.parts}
                regions={mapStatus.regions}
                generation={0}
                getPartById={id => mapStatus.getPartById(id)}
            />
        </svg>)
        return ReactDOMServer.renderToString(map)
}

export async function downloadText(type: string, content: string){
    const blob = new Blob([content], {type})
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const time = moment()
    a.download = `23earth_${time.format("YYYY-MM-DD_hh:mm:ss")}.svg`;
    a.click();
}

export async function exportCurrentMap(){
    const html = await renderCurrentMap()
    downloadText("image/svg+xml", html)
}