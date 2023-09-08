const config = () => {
    return {

        "outputPathBase": "../assets/",

        "fileTypeEnums": {
            "profile": 1,
            "cover": 2,
            "storyImage": 3,
            "video": 4,
            "photo": 5,
            "pdf": 6
        },

        "supportedExtensions": {
            "all": [ "jpg", "jpeg", "png", "JPG", "JPEG", "PNG", "mp4", "MP4", "pdf", "PDF" ],
            "1": [ "jpg", "jpeg", "png", "JPG", "JPEG", "PNG" ],
            "2": [ "jpg", "jpeg", "png", "JPG", "JPEG", "PNG" ],
            "3": [ "jpg", "jpeg", "png", "JPG", "JPEG", "PNG" ],
            "4": [ "mp4", "MP4" ],
            "5": [ "jpg", "jpeg", "png", "JPG", "JPEG", "PNG" ],
            "6": [ "pdf", "PDF" ]
        },

        "maxFileSizes": {
            "1": 4 * 1024 * 1024, // 4 MB
            "2": 8 * 1024 * 1024, // 8 MB
            "3": 10 * 1024 * 1024, // 10 MB
            "4": 20 * 1024 * 1024, // 20 MB
            "5": 10 * 1024 * 1024, // 10 MB
            "6": 10 * 1024 * 1024, // 10 MB
        },

        "supportedAspectRatios": {
            "1": 1 / 1,
            "2":  4 / 1,
            "3": 9 / 16,
            "4": 9 / 16,
            "5": 1 / 1
        },

        "maxDurationForVideo": 30, // in seconds

        "pdfMaxPageCount": 1
    }
};

module.exports = config;