# ayanami

## Introduction

What is Ayanami?  
Ayanami is a Discord bot built to fetch all versions (watermarked and un-watermarked) of a TikTok video. It also grabs metrics from the video such as like count, comment count and much more.

https://user-images.githubusercontent.com/53623449/147841172-4e9eedd1-6682-4ad4-8515-241e9d27d1c0.mp4

## Usage

Ayanami uses Discord's slash command system to download TikTok videos.
| Command | Description | Usage |
|--------------|-----------|------------|
| /video | Gets a single video from TikTok | /video URL:https://vm.tiktok.com/ZM8K5XLfV |

## Install

### Environment Variables

| Variable | Description                             | Default       | Optional |
| -------- | --------------------------------------- | ------------- | -------- |
| TOKEN    | Your Discord bot token                  | <TOKEN>       | ❌       |
| REPO     | The GitHub repo to download YT-DLP from | yt-dlp/yt-dlp | ✔        |
| UPDATE   | Whether or not to update YT-DLP         | true          | ✔        |

### Docker-Compose

```yml
version: "3.2"
services:
  Ayanami:
    image: ghcr.io/joshua-noakes1/ayanami
    container_name: Ayanami
    restart: unless-stopped
    environment:
      TOKEN: "<TOKEN>"
      REPO: "yt-dlp/yt-dlp"
      UPDATE: "true"
```

### Docker

```shell
docker run -d --name Ayanami --restart=unless-stopped -e TOKEN=<TOKEN> -e REPO="yt-dlp/yt-dlp" -e UPDATE="true" ghcr.io/joshua-noakes1/ayanami
```

### Shell

1. Install ImageMagick with support for WebP using your systems repo manager (APT for Debian based system, Choco for Windows, Brew for mac)
2. Git clone `https://github.com/Joshua-Noakes1/Ayanami.git`
3. Add your environment variables into a .env file
4. Run `npm install`
5. Run `npm run start`
