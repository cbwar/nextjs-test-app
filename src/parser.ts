import {getDataFromCache} from "./cache";
import {ParserResult, ResultType} from "./types";

const jsdom = require("jsdom")
const rtrim = require("rtrim")
const path = require('path');
const crypto = require("crypto");

export async function parseUrl(pageUrl: string): Promise<ParserResult[]> {

    const html = await getPageBody(pageUrl)
    const {document} = new jsdom.JSDOM(html).window
    let results: ParserResult[] = []

    const isImageLink = (url: string): boolean => {
        return /\.(jpe?g|png|gif|svg)/i.test(url)
    }

    const resultsContains = (url: string) => {
        return results.find((item) => item.url === url) !== undefined
    }

    const addImage = (u: string) => {
        const realUrl = getAbsoluteUrl(u, pageUrl)
        if (!resultsContains(realUrl)) {
            results.push({
                url: realUrl,
                referer: pageUrl,
                type: ResultType.Image
            })
        }
    }

    const addLink = (u: string) => {
        const realUrl = getAbsoluteUrl(u, pageUrl)
        if (!resultsContains(realUrl)) {
            results.push({
                url: realUrl,
                referer: pageUrl,
                type: ResultType.Anchor
            })
        }
    }

    // img tags
    document.querySelectorAll('img').forEach((el: HTMLImageElement) => {
        if (el.src === '') {
            return
        }
        addImage(el.src)
    })

    // a tags
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
        if (isImageLink(el.href)) {
            addImage(el.href)
        } else {
            addLink(el.href)
        }
    })

    // style="background-image: url(
    document.querySelectorAll('[style]').forEach((el: HTMLElement) => {
        const bg = el.style.backgroundImage
        const regex = /^url\(["']?([^"'\)]+)["']?\)$/i
        if (bg !== '') {
            const match = bg.match(regex)
            if (match) {
                addImage(match[1])
            }
        }
    })
    return results
}


function getAbsoluteUrl(url: string, referer: string): string {
    const ref = new URL(referer)

    if (url.startsWith('//')) {
        return ref.protocol + url;
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url
    }
    if (url.startsWith('data:')) {
        return url
    }
    if (url.startsWith('/')) {
        return ref.origin + url
    }
    // remove current filename from url, check if file extension is present
    if (/\.\w{1,4}$/i.test(ref.pathname)) {
        return ref.origin + path.dirname(ref.pathname) + '/' + url
    }
    return ref.origin + ref.pathname + '/' + url
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

