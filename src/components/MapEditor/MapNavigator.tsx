import React, { CSSProperties } from 'react';
import { Row, Col, Button } from 'antd';
import { zoomOut, zoomIn, move } from './actions/move';

const style: CSSProperties = {
    position: 'fixed',
    right: '0.5rem',
    bottom: '0.5rem',
    width: '10rem'
}

const NaviBtn = ({icon, onClick}: {icon: string, onClick: () => void}) => (
    <Button shape="round" size="large" style={{backgroundColor: 'black', color: 'white', border: '0.2rem white solid'}} icon={icon} onClick={onClick}/>
)

const RowGutter = 0
const BlockSize = 6

//  U +
// L R
//  D -
const MapNavigator = () => (
    <div style={style}>
        <Row gutter={RowGutter}>
            <Col span={BlockSize}><NaviBtn icon="plus" onClick={zoomIn}/></Col>
            <Col span={BlockSize} offset={BlockSize}><NaviBtn icon="up" onClick={() => move(0, -1)}/></Col>
        </Row>
        <Row gutter={RowGutter}>
            <Col span={BlockSize} offset={BlockSize}><NaviBtn icon="left" onClick={() => move(-1, 0)}/></Col>
            <Col span={BlockSize} offset={BlockSize}><NaviBtn icon="right" onClick={() => move(+1, 0)}/></Col>
        </Row>
        <Row gutter={RowGutter}>
            <Col span={BlockSize}><NaviBtn icon="minus" onClick={zoomOut}/></Col>
            <Col span={BlockSize} offset={BlockSize}><NaviBtn icon="down" onClick={() => move(0, +1)}/></Col>
        </Row>
    </div>
)

export default MapNavigator
