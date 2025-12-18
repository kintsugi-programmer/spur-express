import { Router } from "express";
import { postMessage } from "../controllers/chat.controller";

const router = Router();

router.post("/message", postMessage);

export default router;
