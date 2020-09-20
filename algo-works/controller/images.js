const imageSearch = require('image-search-google');
const download = require('image-downloader');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;
const config = require('../config/config');

const client = new imageSearch(config["GOOGLE_CSE_ID"], config["GOOGLE_SECRET_KEY"]);
cloudinary.config({
    cloud_name: config.CLOUD_NAME,
    api_key: config.API_KEY,
    api_secret: config.API_SECRET
})


/**
 * Takes input to search the text.
 * @param text string
 * @param page number
 */
async function getImages(req, res) {
    let responseData;
    let options;
    try {
        const text = req.query.text;
        const page = req.query.page;
        if (!!page) {
            options = getOptions(page);
        } else {
            options = getOptions(1);
        }
        const resposne = await client.search(text, options);
        const urls = await getUrls(resposne, text);
        responseData = getResponseData(true, 'Uploaded');
        responseData['data'] = urls;
        res.status(responseData.meta.code).json(responseData);
    } catch (e) {
        console.log(e);
        responseData = getResponseData(false, 'Not Uploaded');
        res.status(responseData.meta.code).json(responseData);
    }
}

async function getUrls(response, text) {
    let urls = [];
    for (let i = 0; i < response.length; i++) {
        let url = response[i]['url'];
        const fileData = await saveFileLocal(url);
        const uploadData = await upload(fileData.filename, text);
        urls.push(uploadData.url);
        console.log('uploaded');
        fs.unlinkSync(fileData.filename);
    }
    return urls;
}

async function upload(file, folderName) {
    try {
        const data = await cloudinary.uploader.upload(file, { folder: folderName });
        return data;
    } catch (e) {
        console.log(e);
    }
}


function getOptions(page) {
    const options = {
        page: page,
        size: 'large',
        type: 'face'
    };
    return options;
}

async function saveFileLocal(url) {
    const options = {
        url: url,
        dest: './test'
    }
    try {
        const data = await download.image(options);
        return data;
    } catch (e) {
        console.log(e);
    }
}


function getResponseData(flag, msg) {
    let responseData;
    if (flag) {
        responseData = {
            meta: {
                code: 200,
                success: true,
                message: msg,
            },
        };
    } else {
        responseData = {
            meta: {
                code: 404,
                success: false,
                message: msg,
            },
        };
    }
    return responseData;
}


module.exports = { getImages }