import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

async function testSendGrid() {
  try {
    console.log("📨 Test d'envoi via SendGrid...");

    const response = await axios.post(
      "https://api.sendgrid.com/v3/mail/send",
      {
        personalizations: [
          {
            to: [{ email: "mksow664@gmail.com" }], // email destinataire
            subject: "🔑 Test Email MusicVote",
          },
        ],
        from: { email: process.env.FROM_EMAIL },
        content: [
          {
            type: "text/plain",
            value: "Ceci est un test d'email via SendGrid ✅",
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email envoyé ! Code retour :", response.status);
  } catch (error) {
    console.error("❌ Erreur SendGrid :", error.response?.data || error.message);
  }
}

testSendGrid();
