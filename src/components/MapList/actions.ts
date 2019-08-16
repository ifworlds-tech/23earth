import { mapListStatus } from './store';
import axios from 'axios';
import { MapMeta } from '../../types/map';

export async function loadMapList(){
    const list = (await axios.get<MapMeta[]>("/api/map/list")).data
    mapListStatus.setList(list)
}