import express from "express";
import { PrismaClient } from "@prisma/client";
import { authMiddleware } from "../middleware/auth.js";

const prisma = new PrismaClient();
const router = express.Router();

/**
 * ✅ POST /api/tracks → Créer un nouveau morceau
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, artist, sessionId } = req.body;

    if (!title || !artist || !sessionId) {
      return res.status(400).json({ error: "title, artist et sessionId sont requis" });
    }

    // Vérifier si la session existe
    const session = await prisma.session.findUnique({ where: { id: Number(sessionId) } });
    if (!session) {
      return res.status(404).json({ error: "Session non trouvée" });
    }

    // Vérifier si l'utilisateur a déjà soumis un morceau pour cette session
    const existingTrack = await prisma.track.findUnique({
      where: {
        userId_sessionId: {
          userId: req.user.userId,
          sessionId: Number(sessionId),
        },
      },
    });

    if (existingTrack) {
      return res
        .status(400)
        .json({ error: "Vous avez déjà soumis un morceau pour cette session" });
    }

    // Créer le morceau
    const track = await prisma.track.create({
      data: {
        title,
        artist,
        sessionId: Number(sessionId),
        userId: req.user.userId,
      },
      include: {
        _count: { select: { votes: true } },
        user: { select: { firstname: true, lastname: true, id: true } },
      },
    });

    res.status(201).json(track);
  } catch (err) {
    console.error("❌ Erreur POST /tracks :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * ✅ GET /api/tracks → Retourne toutes les tracks avec user + votes
 */
router.get("/", async (req, res) => {
  try {
    const tracks = await prisma.track.findMany({
      include: {
        user: { select: { id: true, firstname: true, lastname: true } },
        _count: { select: { votes: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(tracks);
  } catch (err) {
    console.error("❌ Erreur GET /tracks :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

/**
 * ✅ DELETE /api/tracks/:id → Supprimer un morceau (uniquement si owner)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const track = await prisma.track.findUnique({ where: { id: Number(id) } });

    if (!track) {
      return res.status(404).json({ error: "Morceau introuvable" });
    }

    if (track.userId !== req.user.userId) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    await prisma.track.delete({ where: { id: Number(id) } });
    res.json({ message: "Morceau supprimé avec succès" });
  } catch (err) {
    console.error("❌ Erreur DELETE /tracks :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
