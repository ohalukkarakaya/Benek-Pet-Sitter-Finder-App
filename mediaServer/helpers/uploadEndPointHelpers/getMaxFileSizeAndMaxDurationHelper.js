const config = require( '../../config' );

const getMaxFileSizeAndMaxDurationHelper = ( fileType ) => {
    let maxFileSize, maxDuration;

    maxFileSize = config().maxFileSizes[ fileType.toString() ];
    maxDuration = fileType === 4
                    ? config().maxDurationForVideo
                    : undefined;

      return { maxFileSize, maxDuration };
}

module.exports =  getMaxFileSizeAndMaxDurationHelper;