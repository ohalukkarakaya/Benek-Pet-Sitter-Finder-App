import { parentPort } from 'worker_threads';
import connectToDatabase from "./connectToDatabaseForWorkers.js";

import logoutWorker from "./authRoutesWorkers/refreshTokenWorkers/logoutWorker.js";
import getUsersAndEventsBySearchValueWorker from "./userRoutesWorkers/userWorkers/getUsersAndEventsBySearchValueWorker.js";

connectToDatabase();

parentPort.on(
    "message", 
    async ( message ) => {
        switch( message.type ){
            case "processGetUsersAndEventsBySearchValue":
                await getUsersAndEventsBySearchValueWorker( message );
            break;
        }
    }
);