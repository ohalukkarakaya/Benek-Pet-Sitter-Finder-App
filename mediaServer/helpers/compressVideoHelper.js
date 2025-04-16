const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const cleanTempFilesHelper = require('./cleanTempFilesHelper');

// ffmpeg ve ffprobe yolunu ayarla (kendi klasöründeki kopya ise)
ffmpeg.setFfmpegPath(path.join(process.cwd(), 'ffmpeg'));
ffmpeg.setFfprobePath(path.join(process.cwd(), 'ffprobe'));

const compressVideoHelper = async (tempFilePath, maxFileSize) => {
    try {
        let fileSize = fs.statSync(tempFilePath).size;
        let newBitrate = 1000;
        let inputPath = tempFilePath;

        if (fs.existsSync('ffmpeg_' + tempFilePath)) {
            inputPath = 'ffmpeg_' + tempFilePath;
        }

        while (fileSize > parseFloat(maxFileSize) && newBitrate > 100) {
            try {
                const outputPath = 'ffmpeg_compress_' + tempFilePath;

                await new Promise((resolve, reject) => {
                    ffmpeg(inputPath)
                        .videoCodec('libx264')
                        .audioCodec('aac')
                        .videoBitrate(`${newBitrate}k`)
                        .addOption('-movflags', '+faststart')
                        .output(outputPath)
                        .on('end', () => {
                            resolve();
                        })
                        .on('error', async (err) => {
                            console.error('ffmpeg hata:', err);
                            await cleanTempFilesHelper(tempFilePath);
                            reject(err);
                        })
                        .run();
                });

                fileSize = fs.statSync(outputPath).size;

                if (fileSize > maxFileSize) {
                    newBitrate -= 100;
                } else {
                    break;
                }
            } catch (error) {
                await cleanTempFilesHelper(tempFilePath);
                console.error('Dosya boyutu düşürme hatası:', error);
                break;
            }
        }
    } catch (err) {
        await cleanTempFilesHelper(tempFilePath);
        console.error(err);
    }
};

module.exports = compressVideoHelper;