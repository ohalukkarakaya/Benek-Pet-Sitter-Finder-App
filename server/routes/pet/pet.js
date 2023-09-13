import express from "express";

import auth from "../../middleware/auth.js";
import editPetAuth from "../../middleware/editPetAuth.js";
import uploadPetProfileImageHelper from "../../utils/fileHelpers/uploadPetProfileImageHelper.js";
import { uploadPetImages } from "../../middleware/imageHandle/serverHandlePetImages.js";
import { uploadPetVaccinationCertificate } from "../../middleware/imageHandle/serverHandlePetVaccinationCertificates.js";

import petInteractions from "./petInteractions.js";

//controllers
import createPetController from "../../controllers/petRoutesControllers/petControllers/createPetController.js";
import editPetProfileImageAndCoverImageController from "../../controllers/petRoutesControllers/petControllers/editPetProfileImageAndCoverImageController.js";
import editPetBioController from "../../controllers/petRoutesControllers/petControllers/editPetBioController.js";
import insertPetsImagesController from "../../controllers/petRoutesControllers/petControllers/insertPetsImagesController.js";
import deletePetsImagesController from "../../controllers/petRoutesControllers/petControllers/deletePetsImagesController.js";
import insertPetVaccinationCertificateController from "../../controllers/petRoutesControllers/petControllers/insertPetVaccinationCertificateController.js";
import editPetVaccinationCertificateDescController from "../../controllers/petRoutesControllers/petControllers/editPetVaccinationCertificateDescController.js";
import deletePetVaccinationCertificateController from "../../controllers/petRoutesControllers/petControllers/deletePetVaccinationCertificateController.js";
import deletePetController from "../../controllers/petRoutesControllers/petControllers/deletePetController.js";
import getPetByIdController from "../../controllers/petRoutesControllers/petControllers/getPetByIdController.js";
import getPetsByJwtController from "../../controllers/petRoutesControllers/petControllers/getPetsByJwtController.js";
import getPetsByUserIdController from "../../controllers/petRoutesControllers/petControllers/getPetsByUserIdController.js"
import getPetImageCommentsController from "../../controllers/petRoutesControllers/petControllers/getPetImageCommentsController.js";
import getPetImageCommentsRepliesController from "../../controllers/petRoutesControllers/petControllers/getPetImageCommentsRepliesController.js";

import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// - tested
//Create Pet
router.post(
  "/createPet", 
  auth,
  createPetController
);

// - tested
//Edit Profile Image and Cover Image of the Pet
router.put(
  "/petProfileImage/:petId", 
  auth,
  uploadPetProfileImageHelper,
  editPetProfileImageAndCoverImageController
);

// - tested
//Edit Pet Bio
router.put(
  "/editPetBioCertificate/:petId",
  auth,
  editPetAuth,
  editPetBioController
);

// - tested
//Insert Images of the pet
router.put(
  "/petsImages/:petId", 
  auth,
  editPetAuth,
  uploadPetImages,
  insertPetsImagesController
);

// - tested
//Delete Images of the pet
router.delete(
  "/petsImages/:petId", 
  auth,
  editPetAuth,
  deletePetsImagesController
);

// - tested
//Insert Vaccination Certificate of the Pet
router.put(
  "/petsVaccinationCertificate/:petId", 
  auth,
  editPetAuth,
  uploadPetVaccinationCertificate,
  insertPetVaccinationCertificateController
);

// - tested
//Edit Certificate desc
router.put(
  "/editVaccinationCertificate/:petId",
  auth,
  editPetAuth,
  editPetVaccinationCertificateDescController
);

// - tested
//Delete Vaccination Certificate of the Pet
router.delete(
  "/petsVaccinationCertificate/:petId",
  auth,
  editPetAuth,
  deletePetVaccinationCertificateController
);

// - tested
//Delete Pet and Clean Dependency
router.delete(
  "/deletePet/:petId",
  auth,
  editPetAuth,
  deletePetController
);

// - tested
//get pet by pet id
router.get(
  "/getPetById/:petId",
  auth,
  getPetByIdController
);

// - tested
//get pets by jwt token
router.get(
  "/getPets",
  auth,
  getPetsByJwtController
);

// - tested
//get pets by userId
router.get(
  "/getPetsByUserId/:userId",
  auth,
  getPetsByUserIdController
);

// - tested
//get image comments
router.get(
  "/getImageComments/:petId/:imageId/:skip/:limit",
  auth,
  getPetImageCommentsController
);

// - tested
//get image comment replies
router.get(
  "/getImageCommentsReplies/:petId/:imageId/:commentId/:skip/:limit",
  auth,
  getPetImageCommentsRepliesController
);

router.use("/interractions", petInteractions);

export default router;
