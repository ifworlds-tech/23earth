import React, { Component } from 'react';
import { MapDataPart } from '../../types/map';
import { RegionInfo } from '../../types/region';
import { mapStatus, toolsStatus } from './store';


interface BackgroundProps {
    background: MapDataPart[]
    borderVisible?: boolean
}

const BorderWidth = 0.5

export class Background extends Component<BackgroundProps>{
    shouldComponentUpdate(){
        return false;
    }
    render(){
        return (<g>
            {this.props.background.map(({id, path, transform}) => (
                <path 
                    d={path}
                    key={id}
                    id={id}
                    fill="black"
                    transform={transform || undefined}
                    stroke="white"
                    strokeWidth={this.props.borderVisible ? BorderWidth : 0}
                    onClick={() => mapStatus.addPart(id)}
                    onMouseOver={evt => {
                        if(evt.buttons > 0 && toolsStatus.paintMode === 'swipe'){
                            mapStatus.addPart(id)
                        }
                    }}
                    />
            ))}
        </g>)
    }
}

interface RegionLayerProps {
    regions: RegionInfo[]
    generation: number
    borderVisible?: boolean
    getPartById: (id: string) => MapDataPart
    onClick?: (partId: string, regionId: string) => void
    onMouseOver?: (partId: string, regionId: string) => void
    onMenu?: (x: number, y: number) => void
}

export class RegionLayer extends Component<RegionLayerProps> {
    shouldComponentUpdate(nextProps: RegionLayerProps): boolean{
        return nextProps.generation === 0 || nextProps.generation !== this.props.generation
    }
    render(){
        const {regions, onClick, onMouseOver, borderVisible, onMenu} = this.props
        return (<g>
            {regions.map(reg => (
                <g key={reg.id}>
                    {reg.parts.map(this.props.getPartById).map(part => (
                        <path
                            key={part.id}
                            d={part.path}
                            fill={reg.color}
                            stroke="white"
                            transform={part.transform || undefined}
                            strokeWidth={borderVisible ? BorderWidth : 0}
                            onClick={evt => {
                                if(onClick){
                                    onClick(part.id, reg.id)
                                }
                            }}
                            onContextMenu={evt => {
                                if(onMenu){
                                    onMenu(evt.pageX, evt.pageY)
                                }
                                evt.preventDefault()
                            }}
                            onMouseOver={evt => onMouseOver && evt.buttons>0 && onMouseOver(part.id, reg.id)}
                        />
                    ))}
                </g>
            ))}
        </g>)
    }
}

type MapContentProps = BackgroundProps & RegionLayerProps

export const MapContent = ({background, borderVisible, ...rest}: MapContentProps) => (
    <g>
        <Background background={background} borderVisible={borderVisible}/>
        <RegionLayer borderVisible={borderVisible} {...rest}/>
    </g>
)
