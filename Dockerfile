# Stage 1: Build the application
FROM node:21-alpine3.18 AS builder

WORKDIR /hr-suite

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json ./
RUN npm ci --force

# Copy the rest of the application files
COPY . .

# Build the application
RUN npx nx build

# Stage 2: Create the runtime image
FROM node:21-alpine3.18

# Set environment variables
ENV NODE_ENV=develpment

WORKDIR /hr-suite

# Copy the build artifacts from the builder stage
COPY --from=builder /hr-suite/dist ./dist
COPY --from=builder /hr-suite/package.json ./
COPY --from=builder /hr-suite/node_modules ./node_modules

# Copy the .env file (if it's part of the build process)
COPY .env .env

ENTRYPOINT [ "node", "--env-file=./.env", "./dist/hr-suite/main.js" ]

# Expose the application port
EXPOSE 4200
