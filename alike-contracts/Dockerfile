# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/contracts ./contracts

# Install monitoring tools
RUN apk add --no-cache curl prometheus-node-exporter

# Create non-root user
RUN addgroup -S alike && adduser -S alike -G alike
USER alike

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8545/health || exit 1

# Set environment variables
ENV NODE_ENV=production \
    PORT=8545

# Expose ports
EXPOSE 8545 8546

# Start the application
CMD ["node", "dist/index.js"]
