# Pokemon Scraper

Searches [nyaa.si](https://nyaa.si) for Pokémon releases by PM or Some-Stuffs and sends them to transmission in a parsable format for your favorite download program (Sonarr)

## Run with Node

##### Needs a transmission server running

```
git clone https://github.com/beschoenen/pm-scraper.git
cd pm-scraper
npm install
npm run scheduled
```

## Run with Docker

##### Needs a transmission server (or container) running

```
docker pull beschoenen/pm-scraper
docker run --name "PM Scraper" beschoenen/pm-scraper
```
