# https://stackoverflow.com/a/71073989
FROM python:slim
WORKDIR /app

# Install NodeJS and ImageMagick
RUN apt-get update
RUN apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
RUN apt-get install -y nodejs imagemagick libmagickwand-dev --no-install-recommends

# Install Playwright and yt-dlp fork
RUN python3 -m pip install --upgrade pip
RUN python3 -m pip install playwright
RUN playwright install-deps
RUN playwright install
RUN python3 -m pip install --force-reinstall https://github.com/redraskal/yt-dlp/archive/refs/heads/fix/tiktok-user.zip

# Copy Files
COPY . .

# Install dependencies
RUN npm install

# Start app
CMD ["npm", "start"]
