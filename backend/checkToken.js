// checkToken.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Charger les variables d'environnement depuis .env
dotenv.config();

const SECRET = process.env.JWT_SECRET || "supersecret";

// Récupérer le token passé en argument
const token = process.argv[2];

if (!token) {
  console.error("❌ Utilisation: node checkToken.js <TON_TOKEN>");
  process.exit(1);
}

try {
  // Vérification complète du token
  const decoded = jwt.verify(token, SECRET);
  console.log("✅ Token valide !");
  console.log("📦 Payload :", decoded);

  // Vérifier la date d'expiration
  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp && decoded.exp < now) {
    console.log("⚠️ Ce token est expiré !");
  } else {
    console.log("⏳ Ce token est encore valide.");
  }
} catch (err) {
  console.error("❌ Token invalide :", err.message);

  // Décodage simple (même si signature invalide) pour voir le payload brut
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    console.log("📦 Payload brut :", payload);
  } catch {
    console.error("Impossible de décoder le payload.");
  }
}
