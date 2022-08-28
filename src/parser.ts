import {getDataFromCache} from "./cache";

const jsdom = require("jsdom")
const rtrim = require("rtrim")
const fs = require('fs');
const path = require('path');
const crypto = require("crypto");

enum ResultType {
    Image = "image",
    Anchor = "anchor",
}

type ParserResult = {
    url: string
    type: ResultType
    referer: string
}

export async function parseUrl(url: string): Promise<ParserResult[]> {
    let results: ParserResult[] = []

    const html = await getPageBody(url)
    const {document} = new jsdom.JSDOM(html).window

    // Find images
    document.querySelectorAll('img').forEach((el: HTMLImageElement) => {
        if (el.src === '') {
            return
        }
        console.log('image found: ' + el.src)
        results.push({
            url: getAbsoluteUrl(el.src, url),
            referer: url,
            type: ResultType.Image
        })
    })

    // Find links
    document.querySelectorAll('a').forEach((el: HTMLAnchorElement) => {
        if (el.href === '') {
            return
        }
        if (el.href.startsWith('#')) {
            return
        }
        if (el.href.startsWith('javascript:')) {
            return
        }
        console.log('href found: ' + el.href)
        results.push({
            url: getAbsoluteUrl(el.href, url),
            referer: url,
            type: ResultType.Anchor
        })
    })

    return results
}


function getAbsoluteUrl(url: string, referer: string): string {
    if (url.startsWith('//')) {
        const ur = new URL(referer)
        return ur.protocol + url;
    }
    if (!url.startsWith('/')) {
        return url;
    }
    return rtrim(referer, '/') + url
}

async function getPageBody(url: string): Promise<string> {
    const hash = crypto.createHmac("md5", "xxx").update(url).digest('hex');

    return await getDataFromCache(path.join('pages', hash + '.html'), async () => {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        const response = await fetch(url);
        const body: string = await response.text()
        if (response.status !== 200) {
            throw new Error('Error fetching url : ' + response.statusText)
        }
        return body
    }, {expire: 300})
}

