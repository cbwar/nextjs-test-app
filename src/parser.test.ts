import * as parser from './parser'
import * as fs from "fs";
import path from "path";

const pageFixture = fs.readFileSync(path.join(__dirname, 'fixtures', 'testpage.html')).toString()

jest.mock('node-fetch', () => jest.fn((url: string) => {
    console.log('mock ' + url)

    if (url === 'testpage.html') {
        return Promise.resolve({
            status: 200,
            statusText: 'ok',
            text: () => Promise.resolve(pageFixture),
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

    const urlProvider: { input: string, referer: string, expected: string }[] = [
        {
            input: 'https://localhost:3000/test',
            referer: 'https://localhost:3000',
            expected: 'https://localhost:3000/test'
        }, {
            input: '/test',
            referer: 'https://localhost:3000',
            expected: 'https://localhost:3000/test'
        }, {
            input: 'image1.jpg',
            referer: 'https://localhost:3000/test/page.html',
            expected: 'https://localhost:3000/test/image1.jpg'
        }, {
            input: 'image2.jpg',
            referer: 'https://localhost:3000/test',
            expected: 'https://localhost:3000/test/image2.jpg'
        }, {
            input: 'image3.jpg',
            referer: 'https://localhost:3000/test/',
            expected: 'https://localhost:3000/test/image3.jpg'
        }, {
            input: '//google.fr',
            referer: 'https://localhost:3000',
            expected: 'https://google.fr'
        }, {
            input: 'data:flsdjfksldf',
            referer: 'https://localhost:3000',
            expected: 'data:flsdjfksldf'
        },
    ]

    describe.each(urlProvider)('getAbsoluteUrl', (data) => {
        it(`should return correct absolute url with '${data.input}'`, () => {
            expect(parser.getAbsoluteUrl(data.input, data.referer))
                .toEqual(data.expected)
        })

    })

    test('getPageBody', async () => {
        const data = await parser.getPageBody('testpage.html', {useCache: false})
        expect(data).toBe(pageFixture)
    })

    test('getPageBody with error', async () => {
        await expect(parser.getPageBody('test_error', {useCache: false}))
            .rejects
            .toThrow('not found')
    })

    describe('parseUrl', () => {

        it('must parse a web page successfully', () => {
            jest.spyOn(parser, 'getPageBody')
                .mockReturnValue(Promise.resolve(pageFixture))
            const results = parser.parseUrl('testpage.html')

            // expect(results).toEqual([])

        })

    })
})
