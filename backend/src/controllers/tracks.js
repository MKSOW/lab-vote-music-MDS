import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * @route GET /api/tracks/session/:sessionId
 * @desc Retourne les morceaux d'une session
 */
export async function getTracksBySession(req, res) {
  const { sessionId } = req.params;

  try {
    const tracks = await prisma.track.findMany({
      where: { sessionId: Number(sessionId) },
      include: {
        votes: true,
        session: true,
        user: true,
      },
    });

    res.json(tracks);
  } catch (err) {
    console.error("❌ Erreur getTracksBySession:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

/**
 * @route POST /api/tracks
 * @desc Ajoute un nouveau morceau à une session
 */
export async function createTrack(req, res) {
  try {
    const { title, artist, sessionId } = req.body;

    const track = await prisma.track.create({
      data: {
        title,
        artist,
        sessionId,
        userId: req.user.userId, // ✅ récupéré depuis le middleware
      },
    });

    res.status(201).json(track);
  } catch (err) {
    console.error("❌ Erreur createTrack :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}



/**
 * @route DELETE /api/tracks/:id
 * @desc Supprime un morceau (seulement si c'est le créateur)
 */
export async function deleteTrack(req, res) {
  const { id } = req.params;
  const userId = req.user?.userId;

  try {
    // Vérifier que le morceau existe
    const track = await prisma.track.findUnique({ where: { id: Number(id) } });
    if (!track) {
      return res.status(404).json({ error: "Morceau introuvable" });
    }

    // Vérifier que l'utilisateur est l'auteur
    if (track.userId !== userId) {
      return res.status(403).json({ error: "Non autorisé" });
    }

    await prisma.track.delete({ where: { id: Number(id) } });
    res.json({ message: "Morceau supprimé avec succès" });
  } catch (err) {
    console.error("❌ Erreur deleteTrack:", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
  // GET /api/tracks
router.get("/", async (req, res) => {
  try {
    const tracks = await prisma.track.findMany({
      select: { id: true, title: true, artist: true, sessionId: true }
    });
    res.json(tracks);
  } catch (err) {
    console.error("❌ Erreur GET /tracks :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

}
