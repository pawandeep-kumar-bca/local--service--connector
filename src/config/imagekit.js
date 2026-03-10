const ImageKit = require("imagekit");

const imagekit = new ImageKit({
publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

const uploadImage = async (file, fileName, folder) => {
try {
const result = await imagekit.upload({
file: file.buffer.toString("base64"),
fileName: fileName,
folder: folder, // dynamic folder
});


return result.url;


} catch (error) {
throw new Error("Image upload failed");
}
};

module.exports = uploadImage;
