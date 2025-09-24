import { verifyToken } from "../utils/jwt.js";

export function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    console.log("🔎 Authorization header reçu :", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ Aucun token reçu !");
      return res.status(401).json({ error: "Token manquant" });
    }

    const token = authHeader.split(" ")[1];
    console.log("🔎 Token extrait :", token);

    const decoded = verifyToken(token);
    console.log("🔎 Résultat verifyToken :", decoded);

    if (!decoded) {
      console.log("❌ Token invalide !");
      return res.status(401).json({ error: "Token invalide ou expiré" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    console.error("❌ Erreur middleware auth :", err);
    return res.status(401).json({ error: "Non autorisé" });
  }
}
