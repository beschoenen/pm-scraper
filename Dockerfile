FROM mhart/alpine-node:latest

MAINTAINER Kevin Richter<me@kevinrichter.nl>

WORKDIR /app

COPY . .

RUN npm ci --no-color

RUN ./node_modules/.bin/tsc

RUN rm index.ts
RUN rm -rf src

COPY ./dist .

RUN rm -rf dist

ENV SCHEDULE "0 0 */2 * * *"
ENV DOWNLOAD_FOLDER ""
ENV TRANSMISSION_HOST "127.0.0.1"
ENV TRANSMISSION_PORT "9091"
ENV TRANSMISSION_USERNAME ""
ENV TRANSMISSION_PASSWORD ""

CMD ["node", "index.js", "--scheduled"]
