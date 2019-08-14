import React, { CSSProperties } from 'react';
import { Row, Col, Button } from 'antd';
import { transformStatus } from './store';
import { zoomOut, zoomIn, move } from './actions/move';

const style: CSSProperties = {
    position: 'fixed',
    right: '1rem',
    top: '1rem',
    width: '6rem'
}

const NaviBtn = ({icon, onClick}: {icon: string, onClick: () => void}) => (
    <Button shape="round" style={{backgroundColor: 'black', color: 'white', border: '2px white solid'}} icon={icon} onClick={onClick}/>
)

const RowGutter = 0


// + -
//  U
// L R
//  D
export default () => (
    <div style={style}>
        <Row gutter={RowGutter}>
            <Col span={8}><NaviBtn icon="plus" onClick={zoomIn}/></Col>
            <Col span={8} offset={8}><NaviBtn icon="minus" onClick={zoomOut}/></Col>
        </Row>
        <Row gutter={RowGutter}>
            <Col span={8} offset={8}><NaviBtn icon="up" onClick={() => move(0, -1)}/></Col>
        </Row>
        <Row gutter={RowGutter}>
            <Col span={8}><NaviBtn icon="left" onClick={() => move(-1, 0)}/></Col>
            <Col span={8} offset={8}><NaviBtn icon="right" onClick={() => move(+1, 0)}/></Col>
        </Row>
        <Row gutter={RowGutter}>
            <Col span={8} offset={8}><NaviBtn icon="down" onClick={() => move(0, +1)}/></Col>
        </Row>
    </div>
)