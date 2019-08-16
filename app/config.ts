import { ConfigFile } from './typs';
import fs from 'fs';

const config: ConfigFile = JSON.parse(fs.readFileSync('../config/config.json').toString('utf-8'))

export default config