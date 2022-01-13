# accore

## Introduction

What is accore?  
accore is a Discord bot built to fetch all versions (watermarked and un-watermarked) of a TikTok video. It also grabs metrics from the video such as like count, comment count and much more.

https://user-images.githubusercontent.com/53623449/147841172-4e9eedd1-6682-4ad4-8515-241e9d27d1c0.mp4

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
      REPO: "ytdl-patched/yt-dlp" # ytdl-patched/yt-dlp is recomended as of now because ytdlp is not working
      UPDATE: "true"
```

### Docker

#### ytdl-patched/yt-dlp is recomended as of now because ytdlp is not working

```shell
docker run -d --name accore --restart=unless-stopped -e TOKEN=<TOKEN> -e REPO="ytdl-patched/yt-dlp" -e UPDATE="true" ghcr.io/joshua-noakes1/accore
```

### Shell

1. Install ImageMagick with support for WebP using your systems repo manager (APT for debian based system, Choco for Windows, Brew for mac)
2. Git clone `https://github.com/Joshua-Noakes1/accore.git`
3. Add your enviroment variables into a .env file  
   3a. Add `ytdl-patched/yt-dlp` as the REPO env, as of now yt-dlp is not working
4. Run `npm install`
5. Run `npm run start`