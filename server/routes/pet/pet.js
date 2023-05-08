import express from "express";

import auth from "../../middleware/auth.js";
import editPetAuth from "../../middleware/editPetAuth.js";
import { updatePetProfileImg } from "../../middleware/imageHandle/serverHandlePetProfileImage.js";
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

import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

//Create Pet
router.post(
  "/createPet", 
  auth,
  createPetController
);

//Edit Profile Image and Cover Image of the Pet
router.put(
  "/petProfileImage/:petId", 
  auth,
  updatePetProfileImg,
  editPetProfileImageAndCoverImageController
);

//Edit Pet Bio
router.put(
  "/editPetBioCertificate/:petId",
  auth,
  editPetAuth,
  editPetBioController
);

//Insert Images of the pet
router.put(
  "/petsImages/:petId", 
  auth,
  editPetAuth,
  uploadPetImages,
  insertPetsImagesController
);

//Delete Images of the pet
router.delete(
  "/petsImages/:petId", 
  auth,
  editPetAuth,
  deletePetsImagesController
);

//Insert Vaccination Certificate of the Pet
router.put(
  "/petsVaccinationCertificate/:petId", 
  auth,
  editPetAuth,
  uploadPetVaccinationCertificate,
  insertPetVaccinationCertificateController
);

//Edit Certificate desc
router.put(
  "/editVaccinationCertificate/:petId",
  auth,
  editPetAuth,
  editPetVaccinationCertificateDescController
);

//Delete Vaccination Certificate of the Pet
router.delete(
  "/petsVaccinationCertificate/:petId",
  auth,
  editPetAuth,
  deletePetVaccinationCertificateController
);

//Delete Pet and Clean Dependency
router.delete(
  "/deletePet/:petId",
  auth,
  editPetAuth,
  deletePetController
);

//get pet by id
router.get(
  "/getPetById/:petId",
  auth,
  getPetByIdController
);

router.use("/interractions", petInteractions);

export default router;
