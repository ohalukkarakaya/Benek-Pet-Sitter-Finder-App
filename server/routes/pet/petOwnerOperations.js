import express from "express";
import Pet from "../../models/Pet.js";
import auth from "../../middleware/auth.js";
import User from "../../models/User.js";
import { handOverInvitationReqParamsValidation } from "../../utils/bodyValidation/pets/handOverInvitationValidationSchema.js";
import PetHandOverInvitation from "../../models/ownerOperations/PetHandOverInvitation.js";

//controllers
import inviteSecondaryOwnerController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/inviteSecondaryOwnerController.js";
import replySecondaryOwnerInvitationController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/replySecondaryOwnerInvitationController.js";
import removeSecondaryOwnerController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/removeSecondaryOwnerController.js";
import petHandOverInvitationController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/petHandOverInvitationController.js";
import replyPetHandOverInvitationController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/replyPetHandOverInvitationController.js";

const router = express.Router();

//send secondary owner invite
router.post(
  "/inviteSecondaryOwner/:petId/:secondaryOwnerId",
  auth,
  inviteSecondaryOwnerController
);

//accept or reject secondary owner invitation
router.put(
  "/secondaryOwnerInvitation/:invitationId/:usersResponse",
  auth,
  replySecondaryOwnerInvitationController
);
  
//Remove secondary owner of the pet
router.put(
  "/removeSecondaryOwner/:petId/:secondaryOwnerId",
  auth,
  removeSecondaryOwnerController
);

//Pet Hand Over Invitation
router.post(
  "/petHandOverInvitation/:petId/:invitedUserId",
  auth,
  petHandOverInvitationController
);

//Accept Or Reject Pet Hand Over Invitation
router.put(
  "/petHandOverInvitation/:invitationId/:usersResponse",
  auth,
  replyPetHandOverInvitationController
);

export default router;