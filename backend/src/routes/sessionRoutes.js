import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      include: {
        tracks: true,
        votes: true
      }
    });
    res.json(sessions);
  } catch (err) {
    console.error("❌ Erreur GET /sessions :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
