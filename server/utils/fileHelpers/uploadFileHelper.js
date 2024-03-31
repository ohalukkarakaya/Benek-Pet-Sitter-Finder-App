import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import mediaServerUrlHelper from "./mediaServerUrlHelper.js";

dotenv.config();
const env = process.env;

const uploadFileHelper = async ( file, fileName, fileType, pathToSend, res ) => {
    try{
        let data = new FormData();

        const header = {
            'private-key': env.BENEK_MEDIA_SERVER_API_KEY,
            'accept': '*/*',
            'connection': 'keep-alive',
            'content-type': 'multipart/form-data'
        }

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: mediaServerUrlHelper() + "upload",
            headers: header
        };

        let isImageLoaded = false;
        while( !isImageLoaded ){
            if( fs.existsSync( fileName ) ){
                isImageLoaded = true;
            }
        }
        
        //insert profile image
        data.append(
                'file',
                fs.createReadStream( fileName )
             );

        //insert file type
        data.append(
                'fileType',
                fileType
             );

        //insert outputpath
        data.append(
                'outputPath', 
                pathToSend
             );

        config.data = data;

        const responseData = await axios.request( config );
        if(
            !responseData
            || responseData.status !== 200
            || responseData.data.error
            || !( responseData.data )
        ){
            if( responseData.status === 401 ){
                return res 
                       ? res.status( 401 )
                            .json(
                                {
                                    error: true,
                                    message: "Internal Server Error"
                                }
                            )
                        : {
                            error: true,
                            message: "Internal Server Error"
                        };
            }

            if( responseData.status === 400 ){
                return res 
                     ? res.status( 400 )
                          .json(
                                {
                                    error: true,
                                    message: responseData.data.message
                                }
                           )
                     : {
                        error: true,
                        message: "Internal Server Error"
                       };
            }

            return res
                   ? res.status( 500 )
                        .json(
                        {
                            error: true,
                            message: "Internal Server Error"
                        }
                        )
                    : {
                        error: true,
                        message: "Internal Server Error"
                    };
        }

        return {
            error: false,
            message: "File succesfully uploaded"
        }

    }catch( err ){
        console.log( "ERROR: uploadFileHelper - ", err );
        return {
            error: true,
            message: "Internal Server Error"
        }

    }
}

export default uploadFileHelper;