import { parentPort } from 'worker_threads';
import connectToDatabase from "./connectToDatabaseForWorkers.js";

import getUsersAndEventsBySearchValueWorker from "./userRoutesWorkers/userWorkers/getUsersAndEventsBySearchValueWorker.js";
import getUsersAndEventsByLocationWorker from "./userRoutesWorkers/userWorkers/getUsersAndEventsByLocationWorker.js";
import getCareGiversBySearchValueWorker from "./userRoutesWorkers/userWorkers/getCareGiversBySearchValueWorker.js";
import getCareGiversByLocationWorker from "./userRoutesWorkers/userWorkers/getCareGiversByLocationWorker.js";

connectToDatabase();

parentPort.on(
    "message", 
    async ( message ) => {
        switch( message.type ){
            case "processGetUsersAndEventsBySearchValue":
                await getUsersAndEventsBySearchValueWorker( message );
            break;

            case "processGetUsersAndEventsByLocation":
                await getUsersAndEventsByLocationWorker( message );
            break;

            case "processGetCareGiversBySearchValue":
                await getCareGiversBySearchValueWorker( message );
            break;

            case "processGetCareGiversByLocation":
                await getCareGiversByLocationWorker( message );
            break;
        }
    }
);