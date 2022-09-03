export function validateUrl(url: string, throws: boolean = false): boolean {

    try {
        new URL(url)
    } catch (err) {
        if (throws) {
            throw new Error(`invalid url '${url}': ${err}`)
        }
        return false
    }

    if (!url.startsWith('https://') && !url.startsWith('http://')) {
        if (throws) {
            throw new Error(`invalid url '${url}': url must start with http or https`)
        }
        return false
    }

    return true
}
