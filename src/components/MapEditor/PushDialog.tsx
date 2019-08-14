import React from 'react';
import {observer} from 'mobx-react'
import FormItem from 'antd/lib/form/FormItem';
import { Input, Modal } from 'antd';
import { uploadInfoStatus, mapStatus } from './store';
import { pushMap } from './actions/ajax';

export default observer(() => (
    <Modal 
        visible={uploadInfoStatus.visible}
        onCancel={() => uploadInfoStatus.hide()}
        onOk={async () => {
            await pushMap({
                author: uploadInfoStatus.author,
                title: uploadInfoStatus.title,
                regions: mapStatus.regions
            })
            uploadInfoStatus.hide()
        }}
        >
        <FormItem label="标题" validateStatus={uploadInfoStatus.title ? "success": "error"}>
            <Input defaultValue={uploadInfoStatus.title} onChange={evt => uploadInfoStatus.setTitle(evt.target.value)}/>
        </FormItem>
        <FormItem label="姓名" validateStatus={uploadInfoStatus.author ? "success": "error"}>
            <Input defaultValue={uploadInfoStatus.author} onChange={evt => uploadInfoStatus.setAuthor(evt.target.value)}/>
        </FormItem>
    </Modal>
))