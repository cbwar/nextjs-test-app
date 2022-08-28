const jsdom = require("jsdom");
const rtrim = require("rtrim")

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
    const response = await fetch(url);

    if (response.status !== 200) {
        throw new Error('Error fetching url : ' + response.statusText)
    }
    const html = await response.text()
    const {document} = new jsdom.JSDOM(html).window

    // Find images
    document.querySelectorAll('img').forEach((el: HTMLImageElement) => {
        results.push({
            url: getAbsoluteUrl(el.src, url),
            referer: url,
            type: ResultType.Image
        })
    })

    // Find links
    document.querySelectorAll('a').forEach((el: HTMLAnchorElement) => {
        if (el.href.startsWith('#')) {
            return
        }
        if (el.href.startsWith('javascript:')) {
            return
        }
        results.push({
            url: getAbsoluteUrl(el.href, url),
            referer: url,
            type: ResultType.Anchor
        })
    })

    return results
}


export function getAbsoluteUrl(url: string, referer: string): string {
    if (!url.startsWith('/')) {
        return url;
    }
    return rtrim(referer, '/') + url
}
