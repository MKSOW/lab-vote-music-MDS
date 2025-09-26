# ---- BACKEND ----
FROM node:20-alpine

# Définir dossier de travail
WORKDIR /app

# Copier package.json + lock et installer les deps
COPY package*.json ./
RUN npm install --omit=dev

# Copier le reste du code
COPY . .

# Exposer le port (correspond à process.env.PORT)
EXPOSE 4000

# Commande de démarrage
CMD ["npm", "start"]
