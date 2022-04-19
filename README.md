# ayanami

## Introduction

What is Ayanami?  
Ayanami is a Discord bot built to fetch all versions (watermarked and un-watermarked) of a TikTok video. It also grabs metrics from the video such as like count, comment count and much more.

[Outdated Video]

<https://user-images.githubusercontent.com/53623449/147841172-4e9eedd1-6682-4ad4-8515-241e9d27d1c0.mp4>

## Supported Architectures

We use Github Actions to build a multi architecture docker image. The build information can be found [here](https://github.com/Joshua-Noakes1/ayanami/blob/trunk/.github/workflows/ci.yml).

Pulling `ghcr.io/joshua-noakes1/ayanami` should return the correct image for your arch.

|  Arch  | Available |     Tag      |
| :----: | :-------: | :----------: |
| x86-64 |     ✔     | Latest / Dev |
| arm64  |     ✔     | Latest / Dev |
| armhf  |     ✔     | Latest / Dev |

## Version Tags

We provide various versions which are available via different tags. Please take caution when use the dev branch.

|  Tag   | Available |                                          Description                                          |
| :----: | :-------: | :-------------------------------------------------------------------------------------------: |
| Latest |     ✔     |                                  A stable and tested branch                                   |
|  Dev   |     ✔     | An unstable and development branch which is updated more often but has the chance to not work |

## Application Setup

Ayanami uses Discord's new [slash command system](https://support.discord.com/hc/en-us/articles/1500000368501-Slash-Commands-FAQ#:~:text=Slash%20Commands%20are%20the%20new,command%20right%20the%20first%20time.) to download TikTok videos.

| Command |                             Description                              |                      Usage                      |
| :-----: | :------------------------------------------------------------------: | :---------------------------------------------: |
| /video  | Downloads a single video or all the videos from an account on TikTok | /video url: \<https://vm.tiktok.com/ZM8K5XLfV/> |

## Usage

Below are some examples to help you get going!

### docker-compose (recomended)

```yml
---
version: "3.2"
services:
  ayanami:
    image: ghcr.io/joshua-noakes1/ayanami
    container_name: ayanami
    environment:
      DCORD_TOKEN: ""
      TZ: "Europe/London"
    restart: unless-stopped
```

### docker cli

```shell
docker run -d \
  --name=ayanami \
  -e DCORD_TOKEN= \
  -e TZ=Europe/London \
  --restart unless-stopped \
  ghcr.io/joshua-noakes1/ayanami
```

## Environment Variables

|     EV      |                     Description                      |    Default    | Optional |
| :---------: | :--------------------------------------------------: | :-----------: | :------: |
| DCORD_TOKEN |                Your Discord bot token                |               |    ❌    |
|    LANG     |      The language which embeds will be sent in.      |      EN       |    ✔     |
|  YTDL_REPO  | The GitHub repo where Youtube-DL is downloaded from  | yt-dlp/yt-dlp |    ✔     |
| YTDL_UPDATE | Whether to update Youtube-DL or not (not-recomended) |     true      |    ✔     |
