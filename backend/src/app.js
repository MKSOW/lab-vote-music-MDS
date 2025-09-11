import express from "express";
import cors from "cors";
import cron from "node-cron";
import { runScraper } from "./jobs/scraper.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("✅ API Music Vote en ligne !");
});

// Lancer le scraping chaque jour à 07h00
cron.schedule("0 7 * * *", async () => {
  console.log("⏰ Cron: lancement du scraping quotidien à 07h00...");
  await runScraper();
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
