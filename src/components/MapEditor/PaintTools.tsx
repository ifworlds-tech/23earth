import React from 'react';
import { Button, Dropdown, Menu, Icon } from 'antd';
import { observer } from 'mobx-react-lite';
import { toolsStatus } from './store';
import { ButtonProps } from 'antd/lib/button';


const ClickIcon = 'edit'
const SwipeIcon = 'highlight'

const PaintSwitchButtonProps: ButtonProps = {
    size: 'large',
    shape: 'round',
    style: {
        position: 'fixed',
        left: '0.5rem',
        bottom: '0.5rem',
        border: 'white 0.2rem solid',
        color: 'white',
        backgroundColor: 'black'
    }
}

export default observer(() => (
    <div>
        <Dropdown placement="topLeft" overlay={
            <Menu>
                <Menu.Item onClick={() => toolsStatus.setPaintMode('click')}>
                    <Icon type={ClickIcon}/>
                    点击添加
                </Menu.Item>
                <Menu.Item onClick={() => toolsStatus.setPaintMode('swipe')}>
                    <Icon type={SwipeIcon}/>
                    滑动添加
                </Menu.Item>
            </Menu>
        }>
            <Button icon={toolsStatus.paintMode === 'click' ? ClickIcon : SwipeIcon} {...PaintSwitchButtonProps}/>
        </Dropdown>
    </div>
))