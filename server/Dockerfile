# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src ./src
COPY scripts ./scripts

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache wget

COPY package*.json ./

RUN npm ci --only=production

COPY --from=builder /app/dist ./dist

# Create data directory for database
RUN mkdir -p /app/data

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production
ENV DB_PATH=/app/data/inventory.db
ENV SEED_DB=true

# Start the server
CMD ["node", "dist/src/index.js"]

