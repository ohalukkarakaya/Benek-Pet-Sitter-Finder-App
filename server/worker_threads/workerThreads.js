import { parentPort } from 'worker_threads';
import connectToDatabase from "./connectToDatabaseForWorkers.js";

import getNewAccessTokenWorker from "./authRoutesWorkers/refreshTokenWorkers/getNewAccessTokenWorker.js";
import logoutWorker from "./authRoutesWorkers/refreshTokenWorkers/logoutWorker.js";
import getUsersAndEventsBySearchValueWorker from "./userRoutesWorkers/userWorkers/getUsersAndEventsBySearchValueWorker.js";

connectToDatabase();

parentPort.on(
    "message", 
    async ( message ) => {
        switch( message.type ){
            case "processRefreshToken":
                await getNewAccessTokenWorker( message );
            break;

            case "processLogout":
                await logoutWorker( message );
            break;

            case "processGetUsersAndEventsBySearchValue":
                await getUsersAndEventsBySearchValueWorker( message );
            break;
        }
    }
);