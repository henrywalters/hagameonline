# ─── Build ───────────────────────────────────────────────────────────────────
FROM node:20-alpine AS build
WORKDIR /app

# Copy local file: dependencies first
COPY hgts/ ./hgts/
COPY hascape/ ./hascape/

# Copy frontend and install
COPY hagameonline/package*.json ./hagameonline/
WORKDIR /app/hagameonline
RUN npm install --no-package-lock

COPY hagameonline/ .
RUN npm run build

# ─── Serve ───────────────────────────────────────────────────────────────────
FROM nginx:stable-alpine
COPY --from=build /app/hagameonline/dist /usr/share/nginx/html
COPY hagameonline/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]