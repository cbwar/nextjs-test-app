const path = require("path")
const moment = require("moment");
const {promises} = require("fs");

export interface CacheOptions {
    /**
     * Expire time in seconds
     */
    expire?: number | undefined

    /**
     * Cache base dir
     */
    basedir?: string | undefined
}

export async function getDataFromCache(filename: string, getData: () => Promise<string>, _options: CacheOptions = {}): Promise<string> {

    const defaults: CacheOptions = {
        expire: 3600,
        basedir: '/tmp'
    }
    const options: CacheOptions = Object.assign({}, defaults, _options)
    const realpath = path.join(options.basedir ?? '/tmp', filename)
    try {

        const stats = await promises.stat(realpath)
        const ctime = moment(stats.ctime)
        const notBefore = moment().subtract(options.expire ?? 3600, 'seconds')
        if (ctime < notBefore) {
            await promises.unlink(realpath)
            console.log('file is expired, deleting cache file')
            throw new Error('file is expired')
        }
        const data = await promises.readFile(realpath, 'utf-8')
        console.log('cache file found: ' + realpath)
        return data
    } catch (err: any) {
        console.log('cache file not found, creating')
        if (err.code === 'ENOENT') {
            console.log('create directory ' + path.dirname(realpath))
            await promises.mkdir(path.dirname(realpath), {recursive: true})
        }
    }

    try {
        const data = await getData()
        await promises.writeFile(realpath, data)
        return data
    } catch (err: any) {
        throw err
    }
}
