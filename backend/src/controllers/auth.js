import { PrismaClient } from "@prisma/client";
import { generateToken, verifyToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

// Étape 1 : Demande de login
export async function requestLogin(req, res) {
  const { email } = req.body;

  const preUser = await prisma.preRegisteredUser.findUnique({ where: { email } });

  if (!preUser) {
    return res.status(400).json({ error: "Email non autorisé" });
  }

  // Vérifie si user existe déjà sinon le crée
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      firstname: preUser.firstname,
      lastname: preUser.lastname,
      promotion: preUser.promotion,
    },
  });

  const token = generateToken({ userId: user.id });
  const link = `${process.env.FRONTEND_URL}/login/${token}`;

  console.log(`📧 Lien de connexion pour ${email} : ${link}`);
  // (Plus tard : envoyer par email)

  return res.json({ message: "Lien de connexion généré", link });
}

// Étape 2 : Login via token
export async function loginWithToken(req, res) {
  const { token } = req.params;
  const data = verifyToken(token);

  if (!data) {
    return res.status(401).json({ error: "Token invalide ou expiré" });
  }

  const user = await prisma.user.findUnique({ where: { id: data.userId } });

  if (!user) {
    return res.status(404).json({ error: "Utilisateur introuvable" });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLogin: new Date() },
  });

  return res.json({ message: "Connexion réussie", user });
}
