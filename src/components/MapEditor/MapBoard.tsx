import React, { CSSProperties, useLayoutEffect } from 'react';
import { observer } from 'mobx-react';
import { mapStatus, transformStatus, toolsStatus } from './store';
import { MapContent } from './mapContent';
import { Modal } from 'antd';
import { move } from './actions/move';


const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    margin: '0',
    left: '0',
    top: '0',
    position: 'absolute',
    overflow: 'hidden'
}


const  SvgBody = observer(() => (
    <svg 
        width="100%" 
        height="100%"
        onWheel={({pageX, pageY, deltaX, deltaY, altKey}) => {
            if(altKey){
                // const dx = (document.body.clientWidth / 2 - pageX) / transformStatus.zoom
                // const dy = (document.body.clientHeight / 2 - pageY) / transformStatus.zoom
                transformStatus.setZoom(Math.pow(1.001, deltaY) * transformStatus.zoom)
            }else{
                transformStatus.setPos(
                    transformStatus.centerX + deltaX / transformStatus.zoom,
                    transformStatus.centerY + deltaY / transformStatus.zoom
                )
            }
        }}
        viewBox={transformStatus.viewBox}>
        <MapContent
            borderVisible
            background={mapStatus.mapData.parts}
            generation={mapStatus.snapshotGeneration}
            regions={mapStatus.regions}
            getPartById={id => mapStatus.getPartById(id)}
            onClick={(partId, regionId) => {
                if(regionId === mapStatus.currentRegionId){
                    mapStatus.deletePart(partId, regionId)
                }else{
                    Modal.confirm({
                        title: "正在编辑其他地区",
                        content: "是否切换到该地区?",
                        onOk: () => mapStatus.setCurrentRegionById(regionId)
                    })
                }
            }}
            onMouseOver={(partId, regionId) => {
                if(toolsStatus.paintMode === "erase"){
                    if(regionId === mapStatus.currentRegionId){
                        mapStatus.deletePart(partId, regionId)
                    }else{
                        Modal.confirm({
                            title: "正在编辑其他地区",
                            content: "是否切换到该地区?",
                            onOk: () => mapStatus.setCurrentRegionById(regionId)
                        })
                    }
                }
            }}
        />
    </svg>
))

export default () => {
    useLayoutEffect(() => {
        const ele = document.querySelector('#mapSvgBody')
        if(ele){
            ele.addEventListener('mousewheel', evt => {
                evt.preventDefault()
            })
        }
    })
    return (
        <div 
            id="mapSvgBody"
            style={containerStyle}
        >
            <SvgBody/>
        </div>
    )
}