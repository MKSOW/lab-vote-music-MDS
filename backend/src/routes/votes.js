import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * ✅ POST /api/votes
 * Crée un vote pour un morceau donné (1 vote max par session & par utilisateur)
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { sessionId, trackId } = req.body;

    if (!sessionId || !trackId) {
      return res.status(400).json({ error: "sessionId et trackId sont requis" });
    }

    // 🔎 Vérifier si la session existe
    const session = await prisma.session.findUnique({ where: { id: Number(sessionId) } });
    if (!session) {
      return res.status(404).json({ error: "Session non trouvée" });
    }

    // 🔎 Vérifier si le morceau existe et correspond bien à cette session
    const track = await prisma.track.findUnique({ where: { id: Number(trackId) } });
    if (!track || track.sessionId !== Number(sessionId)) {
      return res.status(400).json({ error: "Morceau invalide pour cette session" });
    }

    // 🚫 Empêcher de voter pour sa propre proposition
    if (track.userId === req.user.userId) {
      return res.status(403).json({ error: "Vous ne pouvez pas voter pour votre propre proposition" });
    }

    // 🔎 Vérifier si l'utilisateur a déjà voté pour cette session
    const existingVote = await prisma.vote.findUnique({
      where: { userId_sessionId: { userId: req.user.userId, sessionId: Number(sessionId) } },
    });

    if (existingVote) {
      return res.status(400).json({ error: "Vous avez déjà voté pour cette session" });
    }

    // ✅ Créer le vote
    const vote = await prisma.vote.create({
      data: {
        userId: req.user.userId,
        sessionId: Number(sessionId),
        trackId: Number(trackId),
      },
    });

    // 🔢 Compter les votes pour ce morceau (mise à jour temps réel côté front)
    const totalVotes = await prisma.vote.count({ where: { trackId: Number(trackId) } });

    res.status(201).json({
      message: "✅ Vote enregistré avec succès !",
      vote,
      totalVotes,
    });
  } catch (err) {
    console.error("❌ Erreur POST /votes :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * ✅ GET /api/votes/my-votes
 * Récupère tous les votes du jour pour l'utilisateur connecté
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
        createdAt: { gte: startOfDay, lte: endOfDay },
      },
      include: {
        track: { select: { title: true, artist: true } },
        session: { select: { subject: true, start: true, room: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(myVotes);
  } catch (err) {
    console.error("❌ Erreur GET /votes/my-votes :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * ✅ GET /api/votes/can-vote/:sessionId
 * Vérifie si l'utilisateur peut voter pour une session donnée
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
 * 📊 GET /api/votes/session/:sessionId
 * Retourne le classement des morceaux d'une session (triés par nombre de votes)
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
