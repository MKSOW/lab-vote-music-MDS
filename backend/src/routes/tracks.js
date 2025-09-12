import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * ✅ POST /api/tracks → Soumettre un morceau
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, artist, sessionId } = req.body;

    if (!title || !artist || !sessionId) {
      return res.status(400).json({ error: "title, artist et sessionId sont requis" });
    }

    // Vérifier si la session existe
    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) {
      return res.status(404).json({ error: "Session non trouvée" });
    }

    // Vérifier si l'utilisateur a déjà soumis un morceau pour cette session
    const existingTrack = await prisma.track.findUnique({
      where: { userId_sessionId: { userId: req.user.userId, sessionId } },
    });

    if (existingTrack) {
      return res.status(400).json({ error: "Vous avez déjà soumis un morceau pour cette session" });
    }

    // Créer le morceau
    const track = await prisma.track.create({
      data: {
        title,
        artist,
        sessionId,
        userId: req.user.userId,
      },
      include: {
        _count: { select: { votes: true } },
        user: { select: { firstname: true, lastname: true } },
      },
    });

    res.status(201).json(track);
  } catch (err) {
    console.error("❌ Erreur POST /tracks :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * ✅ GET /api/tracks/session/:sessionId → Liste des morceaux d'une session
 */
router.get("/session/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    const tracks = await prisma.track.findMany({
      where: { sessionId: Number(sessionId) },
      include: {
        _count: { select: { votes: true } },
        user: { select: { firstname: true, lastname: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    res.json(tracks);
  } catch (err) {
    console.error("❌ Erreur GET /tracks/session/:sessionId :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * ✅ GET /api/tracks/top → Top 5 morceaux de la journée (toutes sessions confondues)
 */
router.get("/top", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tracks = await prisma.track.findMany({
      where: {
        session: { date: { gte: today } },
      },
      include: {
        _count: { select: { votes: true } },
        session: { select: { subject: true, room: true, start: true } },
        user: { select: { firstname: true, lastname: true } },
      },
      orderBy: {
        votes: { _count: "desc" },
      },
      take: 5,
    });

    res.json(tracks);
  } catch (err) {
    console.error("❌ Erreur GET /tracks/top :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
