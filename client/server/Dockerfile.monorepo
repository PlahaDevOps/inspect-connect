# Multi-stage build for full-stack application

# Stage 1: Build frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci --only=production
COPY client/ .
RUN npm run build

# Stage 2: Build backend
FROM node:20-alpine AS backend-build
WORKDIR /app/server
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .
RUN npm run build

# Stage 3: Production runtime
FROM node:20-alpine AS production
WORKDIR /app

# Install production dependencies
COPY --from=backend-build /app/server/package*.json ./server/
RUN cd server && npm ci --only=production

# Copy built applications
COPY --from=frontend-build /app/client/dist ./client/dist
COPY --from=backend-build /app/server/dist ./server/dist

# Copy necessary files
COPY server/views ./server/views
COPY server/public ./server/public

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 5002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5002/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "server/dist/server.js"]
