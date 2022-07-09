FROM node:18-alpine

RUN mkdir /config

WORKDIR /app

COPY . .

RUN npm ci --only=production --no-color

RUN npm run build

ENV SCHEDULE "0 0 */2 * * *"
ENV DOWNLOAD_FOLDER ""
ENV TIMESTAMP_PATH "/config/timestamp"
ENV TRANSMISSION_HOST "127.0.0.1"
ENV TRANSMISSION_PORT "9091"
ENV TRANSMISSION_USERNAME ""
ENV TRANSMISSION_PASSWORD ""

CMD ["node", "dist", "--scheduled"]
