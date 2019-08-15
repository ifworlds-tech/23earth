import React, { CSSProperties } from 'react';
import { observer } from 'mobx-react';
import { mapStatus, transformStatus, toolsStatus } from './store';
import { MapContent } from './mapContent';
import { Modal } from 'antd';


const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    margin: '0',
    left: '0',
    top: '0',
    position: 'absolute',
    overflow: 'hidden'
}


export default observer(() => (
    <div 
        style={containerStyle}
        onScroll={evt => console.log("SCROLL", evt)}
        >
        <svg 
            width="100%" 
            height="100%" 
            viewBox={transformStatus.viewBox}>
            <MapContent
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
    </div>
))