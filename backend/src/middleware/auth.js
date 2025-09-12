import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  try {
    // Récupérer le token dans l'en-tête Authorization: Bearer <token>
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }

    // Ajouter l'utilisateur décodé dans req.user
    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Erreur middleware auth :", err);
    return res.status(401).json({ error: "Non autorisé" });
  }
}
