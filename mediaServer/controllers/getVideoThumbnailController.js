const getVideoThumbnailHelper = require( '../helpers/getVideoThumbnailHelper' );
const checkFileExistsHelper = require( '../helpers/checkFileExistsHelper' );
const fs = require("fs");

const getVideoThumbnailController = async ( req, res ) => {
    const videoPath = req.query.videoPath;
    const extension = videoPath.split( '.' ).pop();

    if( !videoPath || (extension != 'mp4' && extension != 'MP4') ){
        return res.status( 400 ).json({
          error: true,
          message: "Video Path is required"
        });
    }

    const isVideoExists = await checkFileExistsHelper( videoPath );
    if( !isVideoExists ){
        return res.status( 404 ).json({
          error: true,
          message: "Video not found"
        });
    }

    const thumbnail = await getVideoThumbnailHelper( videoPath );

    const stream = fs.createReadStream( thumbnail );
    stream.pipe( res );

    // Stream'in 'end' olayını dinleyerek thumbnail dosyasını sil
    stream.on('end', () => {
        // Thumbnail dosyasını silme işlemi
        fs.unlink(thumbnail, (err) => {
            if (err) {
                console.error('Thumbnail dosyası silinirken bir hata oluştu:', err);
            }
        });
    });

    // Stream'de bir hata oluştuğunda hata işlemleri
    stream.on('error', (err) => {
        console.error('Thumbnail dosyası stream sırasında bir hata oluştu:', err);
        res.status(500).end();
    });
}

module.exports = getVideoThumbnailController;