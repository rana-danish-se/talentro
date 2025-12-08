import express from "express";
import { getUserBySlug } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:slug", getUserBySlug);

export default router;
