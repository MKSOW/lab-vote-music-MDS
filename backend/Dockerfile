FROM node:20-bookworm-slim

# Installe dépendances pour Puppeteer/Chromium
RUN apt-get update && apt-get install -y \
    chromium \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libdrm2 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    xdg-utils \
  && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV NODE_ENV=production

WORKDIR /app

# Installer deps
COPY package*.json ./
RUN npm install --omit=dev

# Copie du code
COPY . .

# Générer Prisma Client maintenant pour réduire le temps au démarrage
RUN npx prisma generate

# Ajoute un entrypoint pour lancer les migrations avant le serveur
COPY docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 4000
CMD ["/entrypoint.sh"]
