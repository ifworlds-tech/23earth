import { mapIndexLoaders } from '../../mapUtils';
import { mapListStatus } from './store';

export async function loadMapList(){
    const indices = await Promise.all(mapIndexLoaders.map(f => f()))
    mapListStatus.setList(indices)
}