import express from "express";

import { protectRoute } from "../middlewares/protectRoute.js";
import { getStreamToken } from "../controllers/chatControllers.js";

const router = express.Router();

router.get("/token", protectRoute, getStreamToken);

export default router;