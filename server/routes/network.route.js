import express from "express";
import {
  sendInvitation,
  acceptInvitation,
  declineInvitation,
  getSuggestionNetwork,
  getTotalConnections,
  getUserInvitations,
  removeConnection,
  getUserConnections,
} from "../controllers/network.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(protect);

router.post("/send-invitation", sendInvitation);
router.put("/accept-invitation", acceptInvitation);
router.put("/decline-invitation", declineInvitation);
router.post("/remove-connection", removeConnection);
router.get("/invitations", getUserInvitations);
router.get("/connections", getUserConnections);
router.get("/suggestions", getSuggestionNetwork);
router.get("/total-connections", getTotalConnections);

export default router;
