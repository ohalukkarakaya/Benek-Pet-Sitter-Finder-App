import dotenv from "dotenv";

dotenv.config();

const env = process.env;

const mokaCredentialsHelper = () => {
    return {
        "DealerCode": env.MOKA_DEALER_CODE,
        "Username": env.MOKA_USER_NAME,
        "Password": env.MOKA_PASSWORD,
        "CheckKey": env.MOKA_CHECK_KEY
    }
}

export default mokaCredentialsHelper;