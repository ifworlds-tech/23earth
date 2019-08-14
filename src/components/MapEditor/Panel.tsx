import React, { CSSProperties } from 'react';
import EditRegionDialog from './EditRegionDialog'
import { Button, Select, Divider, Icon, Card, Dropdown, Menu, Row, Col, Popconfirm } from 'antd';
import { newRegionStatus, mapStatus, uploadInfoStatus, transformStatus, onlineListStatus } from './store';
import { RegionInfo } from '../../types/region';
import { observer } from 'mobx-react-lite';
import ButtonGroup from 'antd/lib/button/button-group';
import { ColorBlock } from './utils';
import { pushMap, showOnlineItems } from './actions/ajax';
import PushDialog from './PushDialog';
import PullDialog from './PullDialog'

const RegionSelect = observer(() => (
    <Dropdown 
        placement="topLeft" overlay={
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
        <Button style={{width: '100%'}}>
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
))

const RegionTools = observer(() => (
    mapStatus.currentRegionId ? (<Row gutter={10}>
        <Col span={8}>
            <Button
                style={{width: '100%'}}
                type="primary"
                onClick={() => mapStatus.currentRegion && newRegionStatus.edit(mapStatus.currentRegion)}
                >编辑</Button>
        </Col>
        <Col span={8}>
            <Button style={{width: '100%'}} type="default" onClick={() => mapStatus.resetCurrentRegion()}>取消</Button>
        </Col>
        <Col span={8}>
            <Popconfirm
                title="该地区的所有信息都会丢失, 且不可恢复, 确定要删除吗?" 
                okType="danger" 
                onConfirm={() => mapStatus.currentRegionId && mapStatus.deleteRegion(mapStatus.currentRegionId)}>
                <Button style={{width: '100%'}} type="danger">删除</Button>
            </Popconfirm>
        </Col>
    </Row>) : null
))

const style: CSSProperties = {
    position: 'fixed',
    left: '0.5rem',
    bottom: '0.5rem',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: '0.2rem',
    borderStyle: 'dashed',
    maxWidth: 'calc(100% - 1rem)',
    padding: '0.5rem'
}

export default () => (
    <div style={style}>
        <Row>
            <Col span={24}>
                <RegionSelect/>
            </Col>
            <Col span={24}>
                <RegionTools/>
            </Col>
        </Row>
        <Button onClick={() => uploadInfoStatus.show()}>上传</Button>
        <Button onClick={() => showOnlineItems()}>拉取</Button>
        <Popconfirm okType="danger" title="将清空所有本地地图数据, 且无法恢复, 确定要清空吗?" onConfirm={() => {
            mapStatus.reset()
            transformStatus.initStatus()
        }}>
            <Button type="danger">清空地图</Button>
        </Popconfirm>
        <PushDialog/>
        <PullDialog/>
        <EditRegionDialog/>
    </div>
)