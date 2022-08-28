import fs from "fs";
import path from "path";
import moment from "moment";

const util = require('util');
const cachePath = '/tmp'

export interface CacheOptions {
    /**
     * Expire time in seconds
     */
    expire?: number
}

export async function getDataFromCache(filename: string, getData: () => Promise<string>, options: CacheOptions = {}): Promise<string> {
    const realpath = path.join(cachePath, filename)
    const fileStats = (filename: string) => util.promisify(fs.stat)(filename);
    const readFile = (filename: string) => util.promisify(fs.readFile)(filename, 'utf8');

    try {
        const stats = await fileStats(realpath)
        const ctime = moment(stats.ctime)
        const notBefore = moment().subtract(options.expire ?? 3600, 'seconds')
        if (ctime < notBefore) {
            fs.unlinkSync(realpath)
            console.log('file is expired, deleting cache file')
            throw new Error('file is expired')
        }
        const data = await readFile(realpath)
        console.log('cache file found: ' + realpath)
        return data
    } catch (err: any) {
        console.log('cache file not found, creating')
        if (err.code === 'ENOENT') {
            console.log('create directory ' + path.dirname(realpath))
            fs.mkdirSync(path.dirname(realpath), {recursive: true})
        }
    }

    try {
        const data = await getData()
        const writeFile = (filename: string, data: string) => util.promisify(fs.writeFile)(filename, data);
        await writeFile(realpath, data)
        return data
    } catch (err: any) {
        throw err
    }
}
