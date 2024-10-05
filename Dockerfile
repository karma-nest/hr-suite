# Stage 1: Build the application
FROM node:21-alpine3.18 AS builder

WORKDIR /hrx-sync

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm ci

# Copy the rest of the application files
COPY . .

# Build the application
RUN npx nx build

# Stage 2: Create the runtime image
FROM node:21-alpine3.18

# Set environment variables
ENV NODE_ENV=production

WORKDIR /hrx-sync

# Copy the build artifacts from the builder stage
COPY --from=builder /hrx-sync/dist ./dist
COPY --from=builder /hrx-sync/package.json ./
COPY --from=builder /hrx-sync/node_modules ./node_modules

ENTRYPOINT [ "node", "--env-file=./.env", "./dist/hrx-sync/main.js" ]

# Expose the application port
EXPOSE 4200
