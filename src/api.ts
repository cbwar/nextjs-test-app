import {ScrapperApiResponse} from "./types";

export async function scrapperApi(query: string): Promise<ScrapperApiResponse> {
    const response = await fetch(`/api/scrapper?url=${encodeURIComponent(query)}`)
    return await response.json()
}
