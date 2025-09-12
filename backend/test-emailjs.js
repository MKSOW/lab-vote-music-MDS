import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // charge les variables depuis .env

async function testEmail() {
  try {
    console.log("📨 Test direct EmailJS...");

    const response = await axios.post(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        template_params: {
          to_email: "mksow664@gmail.com",
          login_link: "https://exemple.com/login/test",
        },
      },
      { headers: { "Content-Type": "application/json" } }
    );

    console.log("✅ EmailJS a répondu :", response.data);
  } catch (error) {
    console.error("❌ Erreur EmailJS :", error.response?.data || error.message);
  }
}

testEmail();

