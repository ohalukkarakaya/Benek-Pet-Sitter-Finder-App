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

// - tested
//send secondary owner invite
router.post(
  "/inviteSecondaryOwner/:petId/:secondaryOwnerId",
  auth,
  inviteSecondaryOwnerController
);

// - tested
//accept or reject secondary owner invitation
router.put(
  "/secondaryOwnerInvitation/:invitationId/:usersResponse",
  auth,
  replySecondaryOwnerInvitationController
);

// - tested
//get secondary pet owner invitations
router.get(
  "/secondaryOwnerInvitations/:lastItemId/:limit",
  auth,
  getSecondaryOwnerInvitationsController
);

// - tested
//get sended secondary pet owner invitations
router.get(
  "/sendedSecondaryOwnerInvitations/:lastItemId/:limit",
  auth,
  getSendedSecondaryOwnerInvitationsController
);
  
// - tested
//Remove secondary owner of the pet
router.put(
  "/removeSecondaryOwner/:petId/:secondaryOwnerId",
  auth,
  removeSecondaryOwnerController
);

// - tested
//Pet Hand Over Invitation
router.post(
  "/petHandOverInvitation/:petId/:invitedUserId",
  auth,
  petHandOverInvitationController
);

// - tested
//Accept Or Reject Pet Hand Over Invitation
router.put(
  "/petHandOverInvitation/:invitationId/:usersResponse",
  auth,
  replyPetHandOverInvitationController
);

// - tested
//get hand over invitations
router.get(
  "/petHandOverInvitations/:lastItemId/:limit",
  auth,
  getPetHandOverInvitationsController
);

// - tested
//get sended hand over invitations
router.get(
  "/petSendedHandOverInvitations/:lastItemId/:limit",
  auth,
  getPetSendedHandOverInvitationsController
);

export default router;