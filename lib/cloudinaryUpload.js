require('dotenv').config();
const lcl = require('cli-color');
const cloudinary = require('cloudinary').v2;

async function cloudinaryUpload(filePath, fileName) {
    // login to cloudinary
    console.log(lcl.blue("[Cloudinary - Info]"), "Logging into Cloudinary...");
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
        console.log(lcl.green("[Cloudinary - Success]"), "Successfully logged into Cloudinary.");
    } catch (err) {
        console.log(lcl.red("[Cloudinary - Error]"), "Failed to login to Cloudinary.");
        console.log(lcl.red("[Cloudinary - Error]"), err.message);
        console.log(lcl.red("[Cloudinary - Error]"), err.stack);
        return {
            success: false
        }
    }
    // upload file to cloudinary
    console.log(lcl.blue("[Cloudinary - Info]"), "Uploading file to Cloudinary...");
    try {
        var upload = await cloudinary.uploader.upload(filePath, {
            public_id: fileName,
            resource_type: "auto"
        });
        console.log(lcl.green("[Cloudinary - Success]"), "Successfully uploaded file to Cloudinary.");

        return {
            success: true,
            url: upload.secure_url
        }
    } catch (err) {
        console.log(lcl.red("[Cloudinary - Error]"), "Failed to upload file to Cloudinary.");
        console.log(lcl.red("[Cloudinary - Error]"), err.message);
        console.log(lcl.red("[Cloudinary - Error]"), err.stack);
        return {
            success: false
        }
    }
}

module.exports = cloudinaryUpload;