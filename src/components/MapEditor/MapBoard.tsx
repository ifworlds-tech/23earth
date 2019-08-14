import React, { CSSProperties, Component } from 'react';
import { observer } from 'mobx-react';
import { mapStatus, transformStatus } from './store';
import { Modal } from 'antd';
import { MapDataPart } from '../../types/map';


const containerStyle: CSSProperties = {
    width: '100%',
    height: '100%',
    margin: '0',
    left: '0',
    top: '0',
    position: 'absolute',
    overflow: 'hidden'
}

class Background extends Component<{parts: MapDataPart[]}>{
    shouldComponentUpdate(){
        return false;
    }
    render(){
        return (<g>
            {this.props.parts.map(({id, path}) => (
                <path d={path} key={id} id={id} fill="black" stroke="white" strokeWidth={0.5} onClick={() => mapStatus.addPart(id)}/>
            ))}
        </g>)
    }
}


export default observer(() => (
    <div style={containerStyle}>
        <svg width="100%" height="100%" viewBox={transformStatus.viewBox}>
            <Background parts={mapStatus.mapData.parts}/>
            {mapStatus.filledParts.map(({id, path, color, regionId}) => (
                <path d={path} fill={color} stroke="white" strokeWidth={1} key={id} onClick={() => {
                    if(regionId === mapStatus.currentRegionId){
                        mapStatus.deletePart(id, regionId)
                    }else{
                        Modal.confirm({
                            title: "正在编辑其他地区",
                            content: "是否切换到该地区?",
                            onOk: () => mapStatus.setCurrentRegionById(regionId)
                        })
                    }
                }}/>
            ))}
        </svg>
    </div>
))