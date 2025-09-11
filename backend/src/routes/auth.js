import express from "express";
import { requestLogin, loginWithToken } from "../controllers/auth.js";

const router = express.Router();

router.post("/request-login", requestLogin);
router.post("/login/:token", loginWithToken);

export default router;
