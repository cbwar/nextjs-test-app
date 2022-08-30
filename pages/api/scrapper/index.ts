import {NextApiRequest, NextApiResponse} from "next";
import {parseUrl} from "../../../src/parser";
import {validateUrl} from "../../../src/utils";

const handler = async (request: NextApiRequest, response: NextApiResponse) => {

    const url = Array.isArray(request.query.url) ? request.query.url[0] : request.query.url
    if (url === undefined) {
        return response.status(400).json({success: false, message: "url is required"})
    }
    try {
        validateUrl(url, true)
    } catch (err) {
        return response.status(400)
            .json({success: false, url, message: String(err)})
    }

    try {
        const results = await parseUrl(url)
        return response.status(200)
            .json({success: true, url, results});
    } catch (e: any) {
        if (e.code === 'ENOTFOUND') {
            return response.status(404)
                .json({success: false, url, message: "not found"})
        }
        return response.status(400)
            .json({success: false, url, message: e})
    }

}

export default handler