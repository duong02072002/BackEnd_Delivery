const { Storage } = require('@google-cloud/storage');
const { format } = require('util');
const env = require('../config/env')
const url = require('url');
const { v4: uuidv4 } = require('uuid');
const uuid = uuidv4();


const storage = new Storage({
    projectId: "delivery-app-8693a",
    keyFilename: './serviceAccountKey.json'
});

const bucket = storage.bucket("gs://delivery-app-8693a.appspot.com/");

/**
 * Tải tệp lên Bộ lưu trữ Firebase
 * @param {File} file đối tượng sẽ được lưu trữ trong Bộ lưu trữ Firebase
 */
module.exports = (file, pathImage, deletePathImage) => {
    return new Promise((resolve, reject) => {

        console.log('delete path', deletePathImage)
        if (deletePathImage) {

            if (deletePathImage != null || deletePathImage != undefined) {
                const parseDeletePathImage = url.parse(deletePathImage)
                var ulrDelete = parseDeletePathImage.pathname.slice(23);
                const fileDelete = bucket.file(`${ulrDelete}`)

                fileDelete.delete().then((imageDelete) => {

                    console.log('The Image Was Deleted Successfully')
                }).catch(err => {
                    console.log('Failed To Remove Photo, Error:', err)
                });

            }
        }

        if (pathImage) {
            if (pathImage != null || pathImage != undefined) {

                let fileUpload = bucket.file(`${pathImage}`);
                const blobStream = fileUpload.createWriteStream({
                    metadata: {
                        contentType: 'image/png',
                        metadata: {
                            firebaseStorageDownloadTokens: uuid,
                        }
                    },
                    resumable: false

                });

                blobStream.on('error', (error) => {
                    console.log('Error Uploading File To Firebase', error);
                    reject('Something Is Wrong! Unable To Upload At The Moment.');
                });

                blobStream.on('finish', () => {
                    // URL công khai có thể được sử dụng để truy cập trực tiếp vào tệp qua HTTP.
                    const url = format(`https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileUpload.name}?alt=media&token=${uuid}`);
                    console.log('CLOUD STORAGE URL ', url);
                    resolve(url);
                });

                blobStream.end(file.buffer);
            }
        }
    });
}