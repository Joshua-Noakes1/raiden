# accore

## Introduction

What is accore?  
accore is a Discord bot built to fetch all versions (watermarked and un-watermarked) of a TikTok video. It also grabs metrics from the video such as like count, comment count and much more.

https://raw.githubusercontent.com/Joshua-Noakes1/accore/trunk/.github/video/accore.mov

## Usage

accore uses Discord's slash command system to let the download TikTok videos.
| Command | Descripton | Usage |
|--------------|-----------|------------|
| /video | Gets a single video from TikTok | /video url:https://vm.tiktok.com/ZM8K5XLfV # url:To TikTok video |
| /account | Gets all videos from an account on TikTok | /account url:https://tiktok.com/@jokeryoda oldest:True # url:To TikTok account oldest:True to download oldest videos first |

## Install

### Enviroment Variables

| Variable | Descripton                              | Default       | Optional |
| -------- | --------------------------------------- | ------------- | -------- |
| TOKEN    | Your Discord bot token                  | <TOKEN>       | ❌       |
| REPO     | The Github repo to download YT-DLP from | yt-dlp/yt-dlp | ✔        |
| UPDATE   | Weather or not to update YT-DLP         | true          | ✔        |

### Docker-Compose

```yml
version: "3.2"
services:
  accore:
    image: ghcr.io/joshua-noakes1/accore
    container_name: accore
    restart: unless-stopped
    environment:
      TOKEN: "<TOKEN>"
      REPO: "yt-dlp/yt-dlp"
      UPDATE: "true"
```

### Docker

```shell
docker run -d --name accore --restart=unless-stopped -e TOKEN=<TOKEN> -e REPO="yt-dlp/yt-dlp" -e UPDATE="true" ghcr.io/joshua-noakes1/accore
```

### Shell

1. Install ImageMagick with support for WebP using your systems repo manager (APT for debian based system, Choco for Windows, Brew for mac)
2. Git clone `https://github.com/Joshua-Noakes1/accore.git`
3. Add your enviroment variables into a .env file 
4. Run `npm install`
5. Run `npm run start`
