import "dotenv/config";
import { runScraper } from "../jobs/scraper.js";

console.log("🚀 Lancement du scraping manuel...");
runScraper()
  .then(() => {
    console.log("✅ Scraping terminé");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Erreur de scraping :", err);
    process.exit(1);
  });
