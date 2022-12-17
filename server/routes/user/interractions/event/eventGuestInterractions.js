import express from "express";
import User from "../../../../models/User.js";
import Event from "../../../../models/Event/Event.js";
import EventTicket from "../../../../models/Event/EventTicket.js";
import EventInvitation from "../../../../models/Event/Invitations/InviteEvent.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import auth from "../../../../middleware/auth.js";
import QRCode from "qrcode";

dotenv.config();

const router = express.Router();

// upload content or comment after event

//edit contents

//delete contents

export default router;