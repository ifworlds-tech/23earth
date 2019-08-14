import React, { CSSProperties } from 'react';
import { Modal, Spin, List, Button, Popconfirm } from 'antd';
import { onlineListStatus } from './store';
import { observer } from 'mobx-react-lite';
import moment from 'moment';
import { pullAndMerge } from './actions/ajax';


const OnlineList = observer(() => (
    <List>
        {onlineListStatus.onlineList.map(({title, author, time, regionHash}) => (
            <List.Item 
                key={`${time}_${regionHash}`}
                actions={[
                    <Popconfirm title="将获取并合并所有地区信息，该操作无法撤销。" okType="danger" onConfirm={() => pullAndMerge(regionHash)}>
                        <Button type="primary">拉取并合并</Button>
                    </Popconfirm>
                ]}>
                {title} ({author}) {moment(time).format('YYYY年MM月DD日 hh:mm:ss')}
            </List.Item>
        ))}
    </List>
))

export default observer(() => (
    <Modal
        visible={onlineListStatus.visible}
        okButtonProps={{hidden: true}}
        cancelButtonProps={{hidden: true}}
        onCancel={() => onlineListStatus.hide()}
        style={{
            width: '80%',
            height: '80%'
        }}
        bodyStyle={{
            overflowY: 'auto'
        }}
    >
        {onlineListStatus.loading ? <Spin/> : <OnlineList/>}
    </Modal>
))