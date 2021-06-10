import React, { useEffect } from 'react';
import { observer, Provider } from 'mobx-react';
import { mapListStatus } from './store';
import {Link} from 'react-router-dom'
import { Button, Row, Col } from 'antd';
import {loadMapList} from './actions'


const ListBody = observer(() => (
    <div style={{margin: '5rem'}}>
        <h1>地图编辑器</h1>
        <Row>
            {mapListStatus.mapList.map(({title, mapId}, idx) => (
                <Col span={24} key={idx}>
                    <Link to={`/map/${mapId}`}>
                        <Button type="primary" size="large" block style={{backgroundColor: 'black', color: 'white', border: 'none'}}>{title}</Button>
                    </Link>
                </Col>
            ))}
        </Row>
    </div>
))

const MapList = observer(() => (
    mapListStatus.loaded ? 
        <ListBody/> :
        <h1>Loading...</h1>
))

const Index = () => {
    useEffect(() => {
        loadMapList()
    }, [])
    return (
        <Provider mapListStatus={mapListStatus}>
            <MapList/>
        </Provider>
    )
}

export default Index
