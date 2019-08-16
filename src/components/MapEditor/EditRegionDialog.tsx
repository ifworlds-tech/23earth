import React from 'react';
import { Modal, Row, Col, Input } from 'antd';
import { newRegionStatus, mapStatus } from './store';
import FormItem from 'antd/lib/form/FormItem';
import TextArea from 'antd/lib/input/TextArea';
import {SwatchesPicker} from 'react-color';
import { observer } from 'mobx-react';

function saveRegion(){
    mapStatus.updateRegion(newRegionStatus.regionInfo)
    newRegionStatus.hide()
}

export default observer(() => (
    <Modal
        visible={newRegionStatus.mode != 'disabled'}
        onOk={saveRegion}
        onCancel={() => newRegionStatus.hide()}>
        <Row>
            <Col span={24}>
                <FormItem label="名称">
                    <Input value={newRegionStatus.name} onChange={evt => newRegionStatus.setName(evt.target.value)}/>
                </FormItem>
            </Col>
            <Col span={24}>
                <FormItem label="描述">
                    <TextArea value={newRegionStatus.description} onChange={evt => newRegionStatus.setDescription(evt.target.value)}/>
                </FormItem>
            </Col>
            <Col span={24}>
                <SwatchesPicker color={newRegionStatus.color} onChange={color => newRegionStatus.setColor(color.hex)} />
            </Col>
        </Row>
    </Modal>
))