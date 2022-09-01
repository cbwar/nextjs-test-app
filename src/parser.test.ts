import {getAbsoluteUrl, getPageBody} from './parser'
import * as fs from "fs";
import path from "path";

const pageContents = fs.readFileSync(path.join(__dirname, 'fixtures', 'testpage.html'))

jest.mock('node-fetch', () => jest.fn((url: string) => {
    if (url === 'test1') {
        return Promise.resolve({
            status: 200,
            statusText: 'ok',
            text: () => Promise.resolve(pageContents),
        })
    }

    if (url === 'test_error') {
        return Promise.resolve({
            status: 404,
            statusText: 'not found'
        })
    }
}))

describe('parser', () => {


    test('getAbsoluteUrl', () => {
        expect(getAbsoluteUrl('https://localhost:3000/test', 'https://localhost:3000'))
            .toBe('https://localhost:3000/test')
        expect(getAbsoluteUrl('/test', 'https://localhost:3000'))
            .toBe('https://localhost:3000/test')
        expect(getAbsoluteUrl('//google.fr', 'https://localhost:3000'))
            .toBe('https://google.fr')
        expect(getAbsoluteUrl('data:flsdjfksldf', 'https://localhost:3000'))
            .toBe('data:flsdjfksldf')
    })

    test('getPageBody', async () => {
        const data = await getPageBody('test1', {useCache: false})
        expect(data).toBe(pageContents)
    })

    test('getPageBody with error', async () => {
        await expect(getPageBody('test_error', {useCache: false}))
            .rejects
            .toThrow('not found')
    })
})
