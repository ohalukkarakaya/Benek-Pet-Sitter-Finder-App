const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');
const util = require('util');

const chmodPromise = util.promisify(fs.chmod);

const getVideoDimensionsHelper = require('./getVideoDimensionsHelper');
const cleanTempFilesHelper = require('./cleanTempFilesHelper');

// SET FFMPEG PATH (KENDİ KOPYANI KULLANIYORSAN)
ffmpeg.setFfmpegPath(path.join(process.cwd(), 'ffmpeg'));
ffmpeg.setFfprobePath(path.join(process.cwd(), 'ffprobe'));

const cropVideoHelper = async (
    fileType,
    tempFilePath,
    videoMetadata
) => {
    try {
        if (fileType === 4) {
            const { width, height } = await getVideoDimensionsHelper(tempFilePath, videoMetadata);
            const targetAspectRatio = 9 / 16;

            if (width / height !== targetAspectRatio) {
                await chmodPromise(path.join(process.cwd(), 'ffmpeg'), '777');

                let cropFilter = '';

                if (width / height > targetAspectRatio) {
                    const newWidth = height * targetAspectRatio;
                    const xOffset = (width - newWidth) / 2;
                    cropFilter = `crop=${newWidth}:${height}:${xOffset}:0,setdar=0.5625`;
                } else {
                    const newHeight = width / targetAspectRatio;
                    const yOffset = (height - newHeight) / 2;
                    cropFilter = `crop=${width}:${newHeight}:0:${yOffset},setdar=0.5625`;
                }

                const outputPath = path.join(path.dirname(tempFilePath), `ffmpeg_${path.basename(tempFilePath)}`);

                await new Promise((resolve, reject) => {
                    ffmpeg(tempFilePath)
                        .output(outputPath)
                        .outputOptions([
                            '-vf', cropFilter,
                            '-c:v', 'libx264',
                            '-c:a', 'aac',
                            '-movflags', '+faststart',
                            '-preset', 'ultrafast'
                        ])
                        .on('end', () => {
                            resolve();
                        })
                        .on('error', async (err) => {
                            await cleanTempFilesHelper(tempFilePath);
                            console.error('Failed to process video:', err);
                            reject(err);
                        })
                        .run();
                });
            }
        }
    } catch (error) {
        console.error('Video kırma hatası:', error);
    }
};

module.exports = cropVideoHelper;
