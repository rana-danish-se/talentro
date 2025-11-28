import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getProfile,
  getUserProfile,
  updateProfile,
  addProfile,
  updateProfileImage,
  updatePosterImage,
} from "../controllers/profile.controller.js";
import {
  getOwnContactInfo,
  getContactInfo,
  addContactInfo,
  updateContactInfo,
} from '../controllers/contact.controller.js';
import upload from "../middlewares/multer.js";

const router = express.Router();


router.use(protect);


router.get("/me", getProfile); // Getting own profile
router.post("/add", addProfile);
router.put("/update", updateProfile);
router.put("/image", upload.single("image"), updateProfileImage);
router.put("/poster", upload.single("image"), updatePosterImage);



router.get('/contact/me', getOwnContactInfo);
router.post('/contact/add', addContactInfo);
router.put('/contact/update', updateContactInfo);


router.get("/:userId", getUserProfile); 


router.get('/:userId/contact', getContactInfo); 

export default router;