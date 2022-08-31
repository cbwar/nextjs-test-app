import {NextApiRequest, NextApiResponse} from "next";
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

    console.log('downloading image ' + url + ' ...')

    try {
        const res = await fetch(url)
        return response
            .status(200)
            .send(res.body)
    } catch (err) {
        console.log('error: ' + String(err))
        return response
            .status(200)
            .send('')
    }
}
export default handler
