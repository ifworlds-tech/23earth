import React, { useEffect } from 'react';
import {Provider, observer} from 'mobx-react';
import { mapStatus, newRegionStatus, transformStatus, uploadInfoStatus, onlineListStatus, toolsStatus } from './store';
import MapBoard from './MapBoard'
import { initializeMap } from './actions/init';
import Panel from './Panel';
import MapNavigator from './MapNavigator';

const MapEditor = observer(() => (
    mapStatus.loaded ?
    (<div>
        <MapBoard/>
        <Panel/>
        <MapNavigator/>
    </div>) : (
        <h1>Loading...</h1>
    )
))

export default () => {
    useEffect(() => {
        initializeMap()
    }, [])
    return (
        <Provider 
            mapStatus={mapStatus}
            newRegionStatus={newRegionStatus}
            transformStatus={transformStatus}
            uploadInfoStatus={uploadInfoStatus}
            onlineListStatus={onlineListStatus}
            toolsStatus={toolsStatus}>
            <MapEditor/>
        </Provider>
    )
}