import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const deleteFileHelper = async ( fileUrl ) => {
    try{
        const deleteApiUrl = env.BENEK_MEDIA_BASE_URL + `deleteAsset?assetPath=${ fileUrl }`;
        const header = { 
            'private-key': env.BENEK_MEDIA_SERVER_API_KEY
        };

        let config = {
            method: 'delete',
            maxBodyLength: Infinity,
            url: deleteApiUrl,
            headers: header
        };

        const responseData = await axios.request( config );

        if(
            !responseData
            || (
                responseData.status !== 200
                && responseData.status !== 404
            )
        ){
            return {
                error: true,
                message: "Internal Server Error"
            }
        }

        return {
            error: false,
            message: "File removed succesfully"
        }
    }catch( err ){
        console.log( "ERROR: deleteFileHelper - ", err );
        return {
            error: true,
            message: "Internal Server Error"
        }
    }
}

export default deleteFileHelper;