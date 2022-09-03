export enum ResultType {
    Image = "image",
    Anchor = "anchor",
}

export type ParserResult = {
    url: string
    type: ResultType
    referer: string
}

export type ScrapperApiResponse = {
    success: boolean,
    url?: string,
    results?: ParserResult[],
    message?: string,
}
