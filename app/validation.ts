import fs from 'fs';
import Ajv from 'ajv';

const snapshotSchemaAsync = fs.promises.readFile("../schema/UploadSnapshot.json").then(data => {
    return JSON.parse(data.toString("utf-8"))
})

const mapSchemaAsync = fs.promises.readFile("../schema/UploadMapData.json").then(data => {
    return JSON.parse(data.toString("utf-8"))
})

export async function validJson(data: any, schemaPromise: Promise<any>): Promise<string | null>{
    const schema = await schemaPromise
    const ajv = new Ajv()
    return ajv.validate(schema, data) ? null : ajv.errorsText()
}

export async function validCommit(data: any): Promise<string | null> {
    return await validJson(data, snapshotSchemaAsync)
}

export async function validMap(data: any): Promise<string | null> {
    return await validJson(data, mapSchemaAsync)
}

export function isHashString(hash: string): boolean {
    return !!hash.match(/^\w+$/)
}