import express from "express";
import { config } from "dotenv";
import dbConnect from "../dbConnect";

const app = express();

config();
dbConnect();

app.use(express.json());

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Listening on port ${port}...'));