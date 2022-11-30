// ____________________________________________________________________________________________________________________________
// |                                                                                                                          |  
// |                                           88             88  88                      88  88                         88   |
// |                                                                                                                     88   |
// |   dP""b8    db    88     88 .dP"Y8      dP"Yb  Yb    dP 88   88 88b 88       dP""b8 88   88 Yb    dP 888888 88b 88  88   |
// |  dP   `"   dPYb   88     88 `Ybo."     dP   Yb  Yb  dP  88   88 88Yb88      dP   `" 88   88  Yb  dP  88__   88Yb88  88   |
// |  Yb       dP__Yb  88  .o 88 o.`Y8b     Yb   dP   YbdP   Y8   8P 88 Y88      Yb  "88 Y8   8P   YbdP   88""   88 Y88       |
// |   YboodP dP""""Yb 88ood8 88 8bodP' dp   YbodP     YP    `YbodP' 88  Y8 db    YboodP `YbodP'    YP    888888 88  Y8  88   |
// |                                    d                                   d                                                 |    
// |     88                       88                                                                                          |
// |                                                                                                                          |
// |                                                                                                                          |
// |                                                                                -::.                                      |
// |                                                                            ..-*.                                         |
// |                                                                  .=  .:...  :* .=                                        |
// |                                                                .+#::.     .:-::=                                         |
// |                                                    .=     ::::=#.     .: :.=#--..                                        |
// |                  :                       .:       -*:::::.   :=. : :-.:%-  #     ::::                                    |
// |                :+.     -             .===::*-..:=%=:  .::. . -::+*:*:                ::.                                 |
// |              :*:     ::           .--:    #@:.:-+=  :*--%:.  +-  :                     .=                                |
// |            .+=    ::.            +=.    :#%. :.=- .:%-=+=                               :-                               |
// |          .+#-:--*+.            .+.    .+-+ :: :+..  :.                                 :-                                |
// |      ..:=%-:::.    ..:.       :=     == +=:   ..                                   ...:                                  |
// |      :=+:.            :: :.  :#    --                                         .....                                      |
// |     .+-                =     .=-:::                                   .......                                            |
// |    =-                 .+                      .-==---.      .........                                                    |
// |  -=            :    .=+                      .#=:::........                                                              |
// |                :::--:                                                                                                    |
// |                                                                                                                          |
// |____ Özgür Haluk KARAKAYA ________________________________________________________________________________________________|


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