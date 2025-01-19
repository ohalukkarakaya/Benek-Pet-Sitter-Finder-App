// ____________________________________________________________________________________________________
// |                                                                                                  |                            
// |                                                                                                  |                            
// |                                                                                  -::.            |                            
// |                                                                              ..-*.               |                            
// |                                                                    .=  .:...  :* .=              |                            
// |                                                                  .+#::.     .:-::=               |                            
// |                                                      .=     ::::=#.     .: :.=#--..              |                            
// |                    :                       .:       -*:::::.   :=. : :-.:%-  #     ::::          |                            
// |                  :+.     -             .===::*-..:=%=:  .::. . -::+*:*:                ::.       |                           
// |                :*:     ::           .--:    #@:.:-+=  :*--%:.  +-  :                     .=      |                           
// |              .+=    ::.            +=.    :#%. :.=- .:%i-=+=                               :-     |
// |            .+#-:--*+.            .+.    .+-+ :: :+..  :.                                 :-      |                            
// |        ..:=%-:::.    ..:.       :=     == +=:   ..                                   ...:        |                            
// |        :=+:.            :: :.  :#    --                                         .....            |                            
// |       .+-                =     .=-:::                                   .......                  |                            
// |      =-                 .+                      .-==---.      .........                          |                            
// |    -=            :    .=+                      .#=:::........                                    |                            
// |                  :::--:                                                                          |                            
// |                                                                                                  |                            
// |                                                                                                  |
// |__ Öğün, Çalış, Güven! ___________________________________________________________________________|


import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from "morgan";
import jwt from "jsonwebtoken";

import authRoutes from './routes/auth/auth.js';
import refreshTokenRoutes from './routes/auth/refreshToken.js';
import editUserRoutes from './routes/user/user.js';
import petRoutes from './routes/pet/pet.js';
import petOwnerOperationsRoutes from './routes/pet/petOwnerOperations.js';
import careGiveRoutes from './routes/cere_give/careGive.js';
import animalKeywordRoutes from './routes/key_words/animalCategory.js';
import chatRoutes from './routes/chat/chat.js';
import notificationRoutes from './routes/notification/notification.js';
import logRoutes from './routes/log/log.js';
import paymentRoutes from './routes/paymentRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';

import bodyParser from 'body-parser';

import expireStories from './cron_jobs/deleteExpiredStories.js';
import expireEvents from './cron_jobs/deleteExpiredEvents.js';
import expireCareGive from './cron_jobs/deleteExpiredCareGive.js';
import expireUser from './cron_jobs/deleteExpiredUser.js';
import expirePunishments from './cron_jobs/deleteExpiredPunishments.js';
import deleteOverTimedLogs from './cron_jobs/deleteOverTimedLogs.js';

import http from 'http';
import initMeetingServer from './utils/meetingServices/meeting-server.js';

import parseLogData from './utils/log/parseLog.js';
import saveLogHelper from './utils/log/saveLogHelper.js';

const app = express();
dotenv.config();

// - tested
expireStories;

// - tested
expireEvents;

// - tested
expireCareGive;

// - tested
expireUser;

// - 
expirePunishments;

// - tested
deleteOverTimedLogs;

const connect = () => {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB).then(
        () => {
          console.log("MongoDB Status: Connected");
        }
    ).catch(
      (err) => {
        throw err;
      }
    );
}

const server = http.createServer( app );
initMeetingServer( server );

morgan.token(
  "userId",
  ( req ) => {
    const token = req.header( "x-access-token" );
    if( !token ){
      const refreshToken = req.body.refreshToken;
      if( !refreshToken ){
        return "No Token Provided";
      }
      
      return `RefreshToken: ${ refreshToken }`;
    }

    try{
      const tokenDetails = jwt.verify( token, process.env.ACCESS_TOKEN_PRIVATE_KEY );
      return tokenDetails._id.toString();
    }catch( err ){
      if( err.name === 'TokenExpiredError' ){
        // Token süresi dolmuşsa
        return "Expired Token";
      } else {
        // Diğer hatalar
        return "Invalid Token";
      }
    }
  }
);

app.use( 
    morgan( 
      ':userId | :method :url - :status - :res[content-length] - :response-time ms',
      {
        stream: {
          write: async ( log ) => {
            try{
              // Log işleme
              const logData = await parseLogData( log );
              saveLogHelper( logData );
            }catch( err ){
              console.log( err );
            }
          },
        }
      }
    ) 
);

app.use(express.static('src'));

app.use( express.json() );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));


app.use("/log", logRoutes);
app.use("/api/refreshToken", refreshTokenRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/user", editUserRoutes);
app.use("/api/pet", petRoutes);
app.use("/api/petOwner", petOwnerOperationsRoutes);
app.use("/api/keywords/animals", animalKeywordRoutes);
app.use("/api/careGive", careGiveRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status( status ).json({
    success: false,
    status: status,
    message: message,
  })
});



app.listen(8800, () => {
  connect();
  console.log("Server Status: Connected");
});