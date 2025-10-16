import express from "express";
import {
  getAllServices,
  addService,
  requestService,
  getIncomingRequests,
} from "../controllers/service.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/requests/incoming", getIncomingRequests);

router.route("/").get(getAllServices).post(addService);

router.route("/:serviceId/request").post(requestService);

export default router;
