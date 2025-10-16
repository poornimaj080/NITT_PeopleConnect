import express from "express";
import { loginUser, getAllFaculty } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", loginUser);
router.get("/faculty", authenticateToken, getAllFaculty);

export default router;
