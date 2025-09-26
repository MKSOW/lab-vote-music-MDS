# ---- FRONTEND ----
FROM node:20-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Utiliser nginx pour servir les fichiers compilés
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copie un nginx.conf custom si besoin (sinon optionnel)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
