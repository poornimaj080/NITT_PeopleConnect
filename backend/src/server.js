import express from "express";
import cors from "cors";
import "dotenv/config";
import { initDriver, closeDriver } from "./config/db.js";

import authRoutes from "./api/routes/auth.routes.js";
import serviceRoutes from "./api/routes/service.routes.js";
import doubtRoutes from "./api/routes/doubt.routes.js";

const app = express();
const PORT = process.env.PORT || 8000;

const corsOptions = {
  origin: "http://localhost:5173", // Ensure this matches your frontend port
  optionsSuccessStatus: 200,
};

// --- MIDDLEWARE ---
// These should always come first.
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- PUBLIC ROUTES ---
// The simple, public welcome route comes BEFORE any protected API routes.
app.get("/", (req, res) => {
  res.status(200).send("Welcome to the People of NIT Trichy API!");
});

// --- API ROUTES ---
// These are prefixed and come after the public routes.
app.use("/api/auth", authRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/doubts", doubtRoutes);

// --- SERVER STARTUP ---
const startServer = async () => {
  try {
    await initDriver();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("🔴 Failed to start the server:", error);
  }
};

// --- GRACEFUL SHUTDOWN ---
process.on("exit", async () => {
  console.log("Server shutting down...");
  await closeDriver();
});

startServer();
