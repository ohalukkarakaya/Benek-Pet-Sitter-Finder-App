const getVideoDurationHelper = (metadata) => {
    try {
        if (!metadata || !Array.isArray(metadata.streams)) {
            console.log("❌ Geçersiz metadata geldi:", metadata);
            return null;
        }

        for (let metaDataStream of metadata.streams) {
            if (metaDataStream.duration !== undefined) {
                return metaDataStream.duration;
            }
        }

        // Hiçbir stream'de duration yoksa
        return null;
    } catch (err) {
        console.log("Video duration helper hatası -", err);
        return null;
    }
};


module.exports = getVideoDurationHelper;