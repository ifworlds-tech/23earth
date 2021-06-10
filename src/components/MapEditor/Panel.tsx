import React, { CSSProperties } from 'react';
import EditRegionDialog from './EditRegionDialog'
import { Button, Icon, Dropdown, Menu, Row, Col, Popconfirm } from 'antd';
import { newRegionStatus, mapStatus, uploadInfoStatus, transformStatus, toolsStatus } from './store';
import { observer } from 'mobx-react-lite';
import { ColorBlock } from './utils';
import { showOnlineItems } from './actions/ajax';
import PushDialog from './PushDialog';
import PullDialog from './PullDialog'
import { exportCurrentMap, exportCurrentMapAsPng } from './actions/export';
import ButtonGroup from 'antd/lib/button/button-group';
import { ButtonProps } from 'antd/lib/button';

const BtnProps: ButtonProps = {
    ghost: false,
    block: true
}

const RegionSelect = observer(() => (
    <Col span={24}>
    <Dropdown 
        overlayStyle={{
            maxHeight: '60vh',
            overflowY: 'auto'
        }}
        placement="bottomLeft" overlay={
            <Menu>
                {mapStatus.regions.map(r => (
                    <Menu.Item 
                        key={r.id}
                        onClick={() => mapStatus.setCurrentRegion(r)}
                    >
                        <ColorBlock color={r.color}/>
                        {r.name}
                    </Menu.Item>
                ))}
                <Menu.Item onClick={() => newRegionStatus.create()}>
                    <Icon type="plus"/>
                    增加地区
                </Menu.Item>
            </Menu>
        }>
        <Button {...BtnProps}>
            {
                mapStatus.currentRegion ?
                <span>
                    <ColorBlock color={mapStatus.currentRegion.color}/>
                    {mapStatus.currentRegion.name}
                </span> :
                "未选择"
            }
        </Button>
    </Dropdown>
    </Col>
))

const RegionTools = observer(() => (
    mapStatus.currentRegionId ? (<ButtonGroup style={{width: '100%'}}>
        <Row>
            <Col span={8}>
                <Button
                    {...BtnProps}
                    icon="edit"
                    type="primary"
                    onClick={() => mapStatus.currentRegion && newRegionStatus.edit(mapStatus.currentRegion)}
                    >编辑</Button>
            </Col>
            <Col span={8}>
                <Button {...BtnProps} type="default" icon="minus" onClick={() => mapStatus.resetCurrentRegion()}>取消</Button>
            </Col>
            <Col span={8}>
                <Popconfirm
                    title="该地区的所有信息都会丢失, 且不可恢复, 确定要删除吗?" 
                    okType="danger" 
                    icon="delete"
                    onConfirm={() => mapStatus.currentRegionId && mapStatus.deleteRegion(mapStatus.currentRegionId)}>
                    <Button {...BtnProps} type="danger">删除</Button>
                </Popconfirm>
            </Col>
        </Row>
    </ButtonGroup>) : null
))

const Export = () => (
    <Dropdown overlay={
        <Menu>
            <Menu.Item onClick={exportCurrentMap}>SVG格式</Menu.Item>
            <Menu.Item onClick={() => exportCurrentMapAsPng(1080)}>PNG格式(1080p)</Menu.Item>
        </Menu>
    }>
        <Button {...BtnProps} icon="export">导出</Button>
    </Dropdown>
)

const Tools = () => (
    <ButtonGroup style={{width: '100%'}}>
                    <Row>
                        <Col span={6}>
                            <Button {...BtnProps} icon="cloud-upload" onClick={() => uploadInfoStatus.show()}>上传</Button>
                        </Col>
                        <Col span={6}>
                            <Button {...BtnProps} icon="cloud-download" onClick={() => showOnlineItems()}>拉取</Button>
                        </Col>
                        <Col span={6}>
                            <Export/>
                        </Col>
                        <Col span={6}>
                            <Popconfirm okType="danger" title="将清空所有本地地图数据, 且无法恢复, 确定要清空吗?" onConfirm={() => {
                                mapStatus.reset()
                                transformStatus.initStatus()
                            }}>
                                <Button {...BtnProps} type="danger" icon="delete">清空地图</Button>
                            </Popconfirm>
                        </Col>
                    </Row>
                </ButtonGroup>
)

const bodyStyle: CSSProperties = {
    position: 'fixed',
    left: '0.5rem',
    top: '0.5rem',
    backgroundColor: 'white',
    color: 'black',
    borderColor: 'black',
    borderWidth: '0.2rem',
    borderStyle: 'dashed',
    maxWidth: 'calc(100% - 1rem)',
    padding: '0.5rem'
}

const MarginStyle: CSSProperties = {
    marginTop: '0.2rem',
    marginBottom: '0.2rem'
}

const PanelBody = observer(() => (
    <div style={{...bodyStyle, display: toolsStatus.panelVisible ? 'block' : 'none'}}>
        <Row>
            <Col style={{textAlign: 'left'}}>
                <Button shape="round" icon="close" size="large" type="dashed" style={{border: 'none'}} onClick={() => toolsStatus.hidePanel()}/>
            </Col>
        </Row>
        <Row>
            <Col span={24} style={MarginStyle}>
                <Tools/>
            </Col>
            <Col span={24} style={MarginStyle}>
                <RegionSelect/>
            </Col>
            <Col span={24} style={MarginStyle}>
                <RegionTools/>
            </Col>
        </Row>

        <PushDialog/>
        <PullDialog/>
        <EditRegionDialog/>
    </div>
))

const buttonStyle: CSSProperties = {
    position: 'fixed',
    top: '1rem',
    left: '1rem',
    backgroundColor: 'black',
    color: 'white',
    border: 'white 0.2rem solid'
}

const PanelButton = observer(() => (
    <Button 
        size="large" 
        shape="round"
        icon="tool"
        style={{...buttonStyle, display: toolsStatus.panelVisible ? 'none' : 'block'}} 
        onClick={() => toolsStatus.showPanel()}
        />
))

const Panel = () => (
    <div>
        <PanelButton/>
        <PanelBody/>
    </div>
)

export default Panel
