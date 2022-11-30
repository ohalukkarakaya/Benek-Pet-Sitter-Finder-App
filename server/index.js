//      ________________________________________________________________________________________________
//      |                                                                                              |                            
//      |                                                                                              |                            
//      |                                                                                -::.          |                            
//      |                                                                            ..-*.             |                            
//      |                                                                  .=  .:...  :* .=            |                            
//      |                                                                .+#::.     .:-::=             |                            
//      |                                                    .=     ::::=#.     .: :.=#--..            |                            
//      |                  :                       .:       -*:::::.   :=. : :-.:%-  #     ::::        |                            
//      |                :+.     -             .===::*-..:=%=:  .::. . -::+*:*:                ::.     |                           
//      |              :*:     ::           .--:    #@:.:-+=  :*--%:.  +-  :                     .=    |                           
//      |            .+=    ::.            +=.    :#%. :.=- .:%-=+=                               :-   |
//      |          .+#-:--*+.            .+.    .+-+ :: :+..  :.                                 :-    |                            
//      |      ..:=%-:::.    ..:.       :=     == +=:   ..                                   ...:      |                            
//      |      :=+:.            :: :.  :#    --                                         .....          |                            
//      |     .+-                =     .=-:::                                   .......                |                            
//      |    =-                 .+                      .-==---.      .........                        |                            
//      |  -=            :    .=+                      .#=:::........                                  |                            
//      |                :::--:                                                                        |                            
//      |                                                                                              |                            
//      |                                                                                              |
//      |____ Çalış, Övün, Güven! _____________________________________________________________________|


import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth/auth.js';
import refreshTokenRoutes from './routes/auth/refreshToken.js';
import editUserRoutes from './routes/edit_user/editUser.js';
import petRoutes from './routes/pet/pet.js';
import animalKeywordRoutes from './routes/key_words/animalCategory.js';
import bodyParser from 'body-parser';

const app = express();
dotenv.config();

const connect = () => {
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

app.use(express.static('src'));

app.use(express.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/api/refreshToken", refreshTokenRoutes);
app.use("/api/user", editUserRoutes);
app.use("/api/pet", petRoutes);
app.use("/api/keywords/animals", animalKeywordRoutes);

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