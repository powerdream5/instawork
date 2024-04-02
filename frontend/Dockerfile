# Stage base
FROM node:20.10-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
COPY next.config.js postcss.config.js tailwind.config.ts tsconfig.json ./
COPY app ./app
COPY public ./public

# Stage builder
FROM node:20.10-alpine AS builder
WORKDIR /app
COPY --from=base /app .
RUN npm ci

ARG NEXT_PUBLIC_API_HOST
ENV NEXT_PUBLIC_API_HOST=${NEXT_PUBLIC_API_HOST}

RUN npm run build

# Stage run
FROM node:20.10-alpine
WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]