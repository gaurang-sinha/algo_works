require('dotenv').config()

const config = {
    "CLOUD_NAME": process.env.CLOUD_NAME,
    "API_KEY" :  process.env.API_KEY,
    "API_SECRET":  process.env.API_SECRET,
    "GOOGLE_CSE_ID" : process.env.GOOGLE_CSE_ID,
    "GOOGLE_SECRET_KEY" : process.env.GOOGLE_SECRET_KEY
}

module.exports =  config ;