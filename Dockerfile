leFROM node:24-alpine

WORKDIR /app

# Copy dependency files and the Prisma schema first
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Install dependencies (this will automatically run the postinstall prisma generate)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
ENV ESLINT_NO_CACHE=1
RUN npm run build

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Run pending Prisma migrations before starting the app
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

ENTRYPOINT ["./docker-entrypoint.sh"]
