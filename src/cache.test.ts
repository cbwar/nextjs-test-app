// @ts-ignore
import mock from 'mock-fs';
import {getDataFromCache} from "./cache";
import * as fs from "fs";

function sleep(millis: number) {
    return new Promise(resolve => setTimeout(resolve, millis));
}

describe('getDataFromCache', () => {
    beforeAll(() => {
        mock({
            'test': {
                'cachefile_2': 'test2',
                'cachefile_3': 'test3'
            }
        });
    });

    afterAll(() => {
        mock.restore();
    });

    test('create cache file if its missing', async () => {
        const cacheFile = `${process.cwd()}/test/cachefile_1`
        if (fs.existsSync(cacheFile)) {
            fs.unlinkSync(cacheFile)
        }
        expect(fs.existsSync(cacheFile)).toBe(false)

        const data = await getDataFromCache('test/cachefile_1', async () => "test1", {basedir: process.cwd()})
        expect(data).toBe("test1")

        expect(fs.existsSync(cacheFile)).toBe(true)
    })

    test('get cache file data', async () => {
        const cacheFile = `${process.cwd()}/test/cachefile_2`
        expect(fs.existsSync(cacheFile)).toBe(true)
        const data = await getDataFromCache('test/cachefile_2', async () => "test3", {basedir: process.cwd()})
        expect(data).toBe("test2")
    })

    test('cache file expired', async () => {
        const cacheFile = `${process.cwd()}/test/cachefile_3`
        expect(fs.existsSync(cacheFile)).toBe(true)
        await sleep(1100)
        const data = await getDataFromCache('test/cachefile_3', async () => "test2", {
            expire: 1,
            basedir: process.cwd()
        })
        expect(data).toBe("test2")
    })

})
