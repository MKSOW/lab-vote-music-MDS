import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendLoginEmail(email, link) {
  try {
    console.log("📨 Tentative d'envoi d'email via SendGrid...");
    const msg = {
  to: email,
  from: process.env.SENDGRID_FROM_EMAIL,
  subject: "🎵 [MusicVote] Lien de connexion sécurisé",
  html: `
    <div style="font-family:Arial, sans-serif; color:#333; max-width:600px; margin:auto; padding:20px; border:1px solid #ddd; border-radius:8px;">
      <h2 style="color:#4CAF50; text-align:center;">Bienvenue sur MusicVote 🎶</h2>
      <p>Bonjour 👋,</p>
      <p>Vous avez demandé à vous connecter à MusicVote. Cliquez sur le bouton ci-dessous pour finaliser votre connexion :</p>
      <p style="text-align:center;">
        <a href="${link}" style="background:#4CAF50;color:white;padding:12px 20px;text-decoration:none;border-radius:5px;display:inline-block;font-weight:bold;">
          Se connecter à MusicVote
        </a>
      </p>
      <p>Ce lien expirera dans 24h pour votre sécurité.</p>
      <hr style="margin:20px 0;">
      <small style="color:#888;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</small>
    </div>
  `
};


    const response = await sgMail.send(msg);
    console.log("✅ Email envoyé avec succès :", response);
    return true;
  } catch (error) {
    console.error("❌ Erreur SendGrid :", error.response?.body || error.message);
    return false;
  }
}
