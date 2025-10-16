import express from "express";
import {
  submitDoubt,
  answerDoubt,
  getDoubts,
} from "../controllers/doubt.controller.js";
import {
  authenticateToken,
  authorizeRole,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticateToken);

router
  .route("/")
  .post(authorizeRole("student"), submitDoubt)
  .get(authorizeRole("student", "faculty"), getDoubts);

router.route("/:doubtId/answer").put(authorizeRole("faculty"), answerDoubt);

export default router;
