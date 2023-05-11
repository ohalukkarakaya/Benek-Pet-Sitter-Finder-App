import express from "express";
import auth from "../../middleware/auth.js";

//controllers
import inviteSecondaryOwnerController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/inviteSecondaryOwnerController.js";
import replySecondaryOwnerInvitationController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/replySecondaryOwnerInvitationController.js";
import removeSecondaryOwnerController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/removeSecondaryOwnerController.js";
import petHandOverInvitationController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/petHandOverInvitationController.js";
import replyPetHandOverInvitationController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/replyPetHandOverInvitationController.js";
import getSecondaryOwnerInvitationsController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/getSecondaryOwnerInvitationsController.js";
import getPetHandOverInvitationsController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/getPetHandOverInvitationsController.js";
import getPetSendedHandOverInvitationsController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/getPetSendedHandOverInvitationsController.js";
import getSendedSecondaryOwnerInvitationsController from "../../controllers/petRoutesControllers/petOwnerOperationsControllers/getSendedSecondaryOwnerInvitationsController.js";

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

//get secondary pet owner invitations
router.get(
  "/secondaryOwnerInvitations/:skip/:limit",
  auth,
  getSecondaryOwnerInvitationsController
);

//get sended secondary pet owner invitations
router.get(
  "/sendedSecondaryOwnerInvitations/:skip/:limit",
  auth,
  getSendedSecondaryOwnerInvitationsController
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

//get hand over invitations
router.get(
  "/petHandOverInvitations/:skip/:limit",
  auth,
  getPetHandOverInvitationsController
);

//get sended hand over invitations
router.get(
  "/petSendedHandOverInvitations/:skip/:limit",
  auth,
  getPetSendedHandOverInvitationsController
);

export default router;