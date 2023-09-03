const getVideoDurationHelper = ( metadata ) => {
    try{
        let duration;
        for(
            let metaDataStream
            of metadata.streams
        ){
            if( metaDataStream.duration !== undefined ){
                duration = metaDataStream.duration;
            }
            break;
        }

        return duration;
    }catch( err ){
        console.log( "Video duration helper hatası - ", err );
    }
}

module.exports = getVideoDurationHelper;