import React, { CSSProperties } from 'react';
import {Menu} from 'antd';
import { observer } from 'mobx-react';
import { toolsStatus } from './store/index';
import { RegionContextMenuStatus } from '../../types/menu';
import { MenuProps } from 'antd/lib/menu';

interface ContextMenuProps {
    style: CSSProperties
}

export const RegionContextMenu = ({regionId, x, y, style}: RegionContextMenuStatus & ContextMenuProps) => (
    <Menu style={style}>
        <Menu.Item>Test</Menu.Item>
    </Menu>
)

export const ToolMenu = observer(() => {
    const menu = toolsStatus.contextMenu
    if(!menu) return null;
    const childStyle: CSSProperties = {
        position: 'fixed',
        left: menu.x,
        top: menu.y,
        zIndex: 101
    }
    return (
        <div>
            <div 
            onClick={() => toolsStatus.resetMenu()}
            style={{
                position: 'fixed',
                left: 0, top: 0,
                width: '100%', height: '100%',
                margin: 0,
                backgroundColor: "black",
                opacity: 0.5,
                zIndex: 100
            }}/>
            {menu.type !== 'region' ? null: <RegionContextMenu {...menu} style={childStyle}/>}
        </div>
    )
})