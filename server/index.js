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
// |              .+=    ::.            +=.    :#%. :.=- .:%-=+=                               :-     |
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

import authRoutes from './routes/auth/auth.js';
import refreshTokenRoutes from './routes/auth/refreshToken.js';
import editUserRoutes from './routes/user/user.js';
import petRoutes from './routes/pet/pet.js';
import petOwnerOperationsRoutes from './routes/pet/petOwnerOperations.js';
import careGiveRoutes from './routes/cere_give/careGive.js';
import animalKeywordRoutes from './routes/key_words/animalCategory.js';
import chatRoutes from './routes/chat/chat.js';

import bodyParser from 'body-parser';

import expireStories from './cron_jobs/deleteExpiredStories.js';
import expireEvents from './cron_jobs/deleteExpiredEvents.js';
import expireCareGive from './cron_jobs/deleteExpiredCareGive.js';
import expireUser from './cron_jobs/deleteExpiredUser.js';

import http from 'http';
import initMeetingServer from './utils/meetingServices/meeting-server.js';

const app = express();
dotenv.config();

expireStories;
expireEvents;
expireCareGive;
expireUser;

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

app.use(express.static('src'));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));

app.use("/auth", authRoutes);
app.use("/api/refreshToken", refreshTokenRoutes);
app.use("/api/user", editUserRoutes);
app.use("/api/pet", petRoutes);
app.use("/api/petOwner", petOwnerOperationsRoutes);
app.use("/api/keywords/animals", animalKeywordRoutes);
app.use("/api/careGive", careGiveRoutes);
app.use("/api/chat", chatRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong";
  return res.status(status).json({
    success: false,
    status: status,
    message: err,
  })
});



app.listen(8800, () => {
  connect();
  console.log("Server Status: Connected");
});