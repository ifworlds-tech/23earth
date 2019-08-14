import React from 'react';


export const ColorBlock = ({color}: {color: string}) => (
    <div style={{
        width: '0.8rem',
        height: '0.8rem',
        display: 'inline-block',
        marginLeft: '0.2rem',
        marginRight: '0.2rem',
        backgroundColor: color
    }}/>
)