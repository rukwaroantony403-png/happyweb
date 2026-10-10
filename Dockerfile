FROM node:22-bookworm-slim AS dependencies
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-bookworm-slim AS build
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
ARG HOTEL_SITE_URL=https://happylandhoteldiani.co.ke
ARG BOOKING_SYSTEM_URL=https://portal.happylandhoteldiani.co.ke
ARG HOTEL_IMAGE_HOSTS=
ENV HOTEL_SITE_URL=${HOTEL_SITE_URL} \
    BOOKING_SYSTEM_URL=${BOOKING_SYSTEM_URL} \
    HOTEL_IMAGE_HOSTS=${HOTEL_IMAGE_HOSTS}
RUN npm run build

FROM node:22-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=build --chown=node:node /app ./
USER node
EXPOSE 3000
CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]
