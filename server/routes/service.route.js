import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
  getServices,
  addService,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", getServices);
router.post("/", addService);
router.put("/:id", updateService);
router.delete("/:id", deleteService);

export default router;
