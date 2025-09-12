import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * ✅ POST /api/votes → Créer un vote
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { sessionId, trackId } = req.body;

    if (!sessionId || !trackId) {
      return res.status(400).json({ error: "sessionId et trackId sont requis" });
    }

    // Vérifier si la session existe
    const session = await prisma.session.findUnique({ where: { id: sessionId } });
    if (!session) return res.status(404).json({ error: "Session non trouvée" });

    // Vérifier si le track existe et appartient à cette session
    const track = await prisma.track.findUnique({ where: { id: trackId } });
    if (!track || track.sessionId !== sessionId) {
      return res.status(400).json({ error: "Track invalide pour cette session" });
    }

    // Vérifier si l'utilisateur a déjà voté pour cette session
    const existingVote = await prisma.vote.findUnique({
      where: { userId_sessionId: { userId: req.user.userId, sessionId } },
    });

    if (existingVote) {
      return res.status(400).json({ error: "Vous avez déjà voté pour cette session" });
    }

    // Créer le vote
    const vote = await prisma.vote.create({
      data: {
        userId: req.user.userId,
        sessionId,
        trackId,
      },
    });

    res.json(vote);
  } catch (err) {
    console.error("❌ Erreur POST /votes :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * ✅ GET /api/votes/my-votes → Récupérer les votes du jour pour l'utilisateur connecté
 */
router.get("/my-votes", authMiddleware, async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const myVotes = await prisma.vote.findMany({
      where: {
        userId: req.user.userId,
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      include: {
        track: { select: { title: true, artist: true } },
        session: { select: { subject: true, start: true, room: true } },
      },
    });

    res.json(myVotes);
  } catch (err) {
    console.error("❌ Erreur GET /votes/my-votes :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * ✅ GET /api/votes/can-vote/:sessionId → Vérifie si l'utilisateur peut voter
 */
router.get("/can-vote/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const existingVote = await prisma.vote.findUnique({
      where: { userId_sessionId: { userId: req.user.userId, sessionId: Number(sessionId) } },
    });

    res.json({
      canVote: !existingVote,
      message: existingVote
        ? "Vous avez déjà voté pour cette session."
        : "Vous pouvez voter pour cette session.",
    });
  } catch (err) {
    console.error("❌ Erreur GET /votes/can-vote :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * 📊 GET /api/votes/session/:sessionId → Classement des votes pour une session
 */
router.get("/session/:sessionId", authMiddleware, async (req, res) => {
  try {
    const { sessionId } = req.params;

    const tracks = await prisma.track.findMany({
      where: { sessionId: Number(sessionId) },
      include: { votes: true },
    });

    const ranking = tracks
      .map((t) => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        votes: t.votes.length,
      }))
      .sort((a, b) => b.votes - a.votes); // tri décroissant

    res.json(ranking);
  } catch (err) {
    console.error("❌ Erreur GET /votes/session/:sessionId :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
