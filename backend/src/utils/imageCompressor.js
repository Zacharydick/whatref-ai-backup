const sharp = require('sharp');

const compressImage = async (buffer) => {
    try {
        const compressedBuffer = await sharp(buffer)
            .resize({ width: 800 }) // Resize to a width of 800 pixels
            .jpeg({ quality: 80 }) // Compress to JPEG format with 80% quality
            .toBuffer();
        return compressedBuffer;
    } catch (error) {
        throw new Error('Error compressing image: ' + error.message);
    }
};

module.exports = compressImage;