import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const students = [
  { firstname: "Othmane", lastname: "BELMAJDOUB", email: "othmane.belmajdoub@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Axel", lastname: "BLANCHARD", email: "axel.blanchard@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Benjamin", lastname: "BONNEVIAL", email: "benjamin.bonnevial@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Anthony", lastname: "BROSSE", email: "anthony.brosse@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Raphaël", lastname: "DUBOST", email: "raphael.dubost@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Bastien", lastname: "FOURNIER", email: "bastien.fournier@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Esteban", lastname: "GASPAR", email: "esteban.gaspar@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Ikram", lastname: "LAHMOURI", email: "ikram.lahmouri@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Hugo", lastname: "MALEZET", email: "hugo.malezet@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Abdelbasir", lastname: "MEFIRE NSANGOU", email: "abdelbasir.mefirensangou@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Said", lastname: "MOHAMED ABDO", email: "said.mohamedabdo@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Sana", lastname: "NAJJAH", email: "sana.najjah@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Mamadou Khaly", lastname: "SOW", email: "mamadoukhaly.sow@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Samantha", lastname: "THIEBAUT", email: "samantha.thiebaut@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Marie", lastname: "TURCO", email: "marie.turco@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Bastien", lastname: "USUBELLI", email: "bastien.usubelli@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Lorenzo", lastname: "VATRIN", email: "lorenzo.vatrin@my-digital-school.org", promotion: "MDS-M1" },
  { firstname: "Adrien", lastname: "VERWAERDE", email: "adrien.verwaerde@my-digital-school.org", promotion: "MDS-M1" }
];

async function main() {
  console.log("🌱 Seeding pre-registered users...");
  for (const student of students) {
    await prisma.preRegisteredUser.upsert({
      where: { email: student.email },
      update: {}, // si déjà existant, ne change rien
      create: student,
    });
  }
  console.log("✅ Seeding terminé !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur de seed :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
