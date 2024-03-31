import dotenv from "dotenv";

dotenv.config();
const env = process.env;

const mediaServerUrlHelper = () => {
    return env.ENVIROMENT === "TEST" ? env.BENEK_MEDIA_LOCAL_PATH : env.BENEK_MEDIA_BASE_URL;
}

export default mediaServerUrlHelper;