import UserToken from "../../../models/UserToken.js";

import { parentPort } from 'worker_threads';
import connectToDatabase from "../../connectToDatabaseForWorkers.js";

connectToDatabase();

const logoutWorker = async ( message ) => {
    const { refreshToken } = message.payload;

    const userToken = await UserToken.findOne({ token: refreshToken });
    if( !userToken ){
        parentPort.postMessage(
            {
                type: "success",
                payload: {
                    error: false,
                    message: "Logged Out Successfully"
                }
            }
        );
    }
    await userToken.remove();
    parentPort.postMessage(
        {
            type: "success",
            payload: {
                error: false,
                message: "Logged Out Successfully"
            }
        }
    );
};

export default logoutWorker;