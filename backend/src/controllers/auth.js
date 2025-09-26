import { PrismaClient } from "@prisma/client";
import { generateToken, verifyToken } from "../utils/jwt.js";
import { sendLoginEmail } from "../services/email.js";

const prisma = new PrismaClient();

/**
 * @route POST /api/auth/request-login
 * @desc Vérifie l'email, crée l'utilisateur si nécessaire et envoie un lien de connexion
 */
export async function requestLogin(req, res) {
  const { email } = req.body;

  try {
    // Vérifier dans PreRegisteredUser
    const preUser = await prisma.preRegisteredUser.findUnique({ where: { email } });

    if (!preUser) {
      return res.status(404).json({ error: "Utilisateur non trouvé dans la liste des pré-inscrits" });
    }

    // Vérifier si l'utilisateur existe déjà dans User
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Créer un nouvel utilisateur
      user = await prisma.user.create({
        data: {
          email: preUser.email,
          firstname: preUser.firstname,
          lastname: preUser.lastname,
          promotion: preUser.promotion,
        },
      });

      // Marquer comme utilisé dans PreRegisteredUser
      await prisma.preRegisteredUser.update({
        where: { email },
        data: { isUsed: true },
      });

      console.log(`👤 Nouvel utilisateur créé pour ${email}`);
    }

    // Générer un token JWT (valide 1 an)
    const token = generateToken({ userId: user.id }, "365d");

    // Construire le lien de connexion
    const loginLink = `${process.env.FRONTEND_URL}/login/${token}`;

    // Envoyer l'email via EmailJS
    const success = await sendLoginEmail(email, loginLink);

    if (!success) {
      return res.status(500).json({ error: "Impossible d'envoyer l'email" });
    }

    console.log(`✅ Lien de connexion envoyé à ${email}`);
    res.json({ message: "Lien de connexion envoyé par email, dans outlook veuillez vérifier dans l'onglet courriers indésirables" });
  } catch (err) {
    console.error("❌ Erreur dans requestLogin :", err);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

/**
 * @route POST /api/auth/login/:token
 * @desc Vérifie le token JWT et retourne les infos utilisateur
 */
export async function loginWithToken(req, res) {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({ error: "Token manquant" });
    }

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

    // ✅ Générer un NOUVEAU token pour le front
    const newToken = generateToken({ userId: user.id }, "365d");

    return res.json({
      message: "Connexion réussie",
      user,
      token: newToken, // ✅ envoie un token au front
    });
  } catch (err) {
    console.error("❌ Erreur dans loginWithToken :", err);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}


/**
 * @route GET /api/auth/me
 * @desc Retourne les infos de l'utilisateur connecté (si token valide)
 */
export async function getMe(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Non authentifié" });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.userId } });

    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable" });
    }

    return res.json(user);
  } catch (err) {
    console.error("❌ Erreur dans getMe :", err);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
