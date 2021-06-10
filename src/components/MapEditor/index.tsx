import React, { useEffect } from 'react';
import {Provider, observer} from 'mobx-react';
import { mapStatus, newRegionStatus, transformStatus, uploadInfoStatus, onlineListStatus, toolsStatus } from './store';
import MapBoard from './MapBoard'
import { initializeMap } from './actions/init';
import Panel from './Panel';
import MapNavigator from './MapNavigator';
import PaintTools from './PaintTools';
import { RouteComponentProps } from 'react-router';

const MapEditor = observer(() => (
    mapStatus.loaded ?
    (<div>
        <MapBoard/>
        <Panel/>
        <MapNavigator/>
        <PaintTools/>
    </div>) : (
        <h1>Loading...</h1>
    )
))

const IndexComp = (props: RouteComponentProps<{mapId: string}>) => {
    useEffect(() => {
        const reg = initializeMap(props.match.params.mapId)
        return () => {reg.then(c => c())}
    }, [props.match.params.mapId])
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

export default IndexComp