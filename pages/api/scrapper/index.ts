import {NextApiRequest, NextApiResponse} from "next";
import {parseUrl} from "../../../src/parser";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {

    const url = Array.isArray(request.query.url) ? request.query.url[0] : request.query.url
    if (url === undefined) {
        return response.status(400).json({success: false, message: "url is required"})
    }
    try {
        new URL(url)
    } catch (e) {
        return response.status(400).json({success: false, message: "url error: " + e})
    }

    const results = await parseUrl(url)
    console.log(results)

    return response.status(200).json({success: true, url, results});
}

export default handler
