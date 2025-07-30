var ImageKit = require("imagekit");
const mongoose = require('mongoose');

var imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.URL_ENDPOINT
});

function uploadfile(file){
    return new Promise((res,rej)=>{
        imagekit.upload({
            file:file.buffer,
            fileName: new mongoose.Types.ObjectId().toString(),
            folder:'Project-Audios'
        },(error,result)=>{
            if(error){
                return rej(error)
            }
            return res(result)
        });
    });
}
module.exports = uploadfile