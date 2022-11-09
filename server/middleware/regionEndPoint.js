import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const getRegionEndPoint = async (req, res, next) => {
    const host = process.env.IDRIVE_PROFILE_GET_REGION_ENDPOINT;
    const body = { access_key: process.env.IDRIVE_ACCESS_KEY };

    const regionRequest = axios.post(
        host,
        body
    ).then(
    regionResponse => {
        if(regionResponse.data.resp_code < 0){
            return res.status(500).json(
                {
                    error: true,
                    message: `iDrive-Error: regionResponse.data.resp_msg`
                }
            );
        } else {
            req.regionEndPoint = regionResponse.data.domain_name;
            next();
        }
    }
  );
}

export default getRegionEndPoint;