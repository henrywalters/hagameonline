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
 
# ─── Runtime ─────────────────────────────────────────────────────────────────
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321
 
# Astro standalone output includes everything needed to run
COPY --from=build /app/hagameonline/dist ./dist
COPY --from=build /app/hagameonline/node_modules ./node_modules
COPY --from=build /app/hagameonline/package.json ./package.json
 
EXPOSE 4321
 
CMD ["node", "./dist/server/entry.mjs"]
 