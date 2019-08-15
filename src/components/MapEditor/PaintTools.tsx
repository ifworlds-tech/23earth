import React from 'react';
import { Button, Dropdown, Menu, Icon } from 'antd';
import { observer } from 'mobx-react-lite';
import { toolsStatus } from './store';
import { ButtonProps } from 'antd/lib/button';
import { PaintToolMode } from './store/ToolsStatus';


const ClickIcon = 'edit'
const SwipeIcon = 'bg-colors'
const EraseIcon = 'scissor'

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

const IconPairs: [PaintToolMode, string, string][] = [
    ["click", ClickIcon, "点击添加"],
    ["swipe", SwipeIcon, "滑动添加"],
    ["erase", EraseIcon, "滑动删除"]
]

const IconMap = new Map(IconPairs.map(([mode, icon]) => [mode, icon]))

export default observer(() => (
    <div>
        <Dropdown placement="topLeft" overlay={
            <Menu>
                {IconPairs.map(([mode, icon, title]) => (
                    <Menu.Item key={mode} onClick={() => toolsStatus.setPaintMode(mode)}>
                        <Icon type={icon}/>
                        {title}
                    </Menu.Item>
                ))}
            </Menu>
        }>
            <Button icon={IconMap.get(toolsStatus.paintMode)} {...PaintSwitchButtonProps}/>
        </Dropdown>
    </div>
))