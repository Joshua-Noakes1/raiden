# From node slim image
# https://stackoverflow.com/a/71073989
FROM python:slim-buster
WORKDIR /app

# Install NodeJS v16.x
RUN \
    apt-get update && \
    apt-get install -yqq gnupg wget curl && \
    echo "deb https://deb.nodesource.com/node_16.x buster main" > /etc/apt/sources.list.d/nodesource.list && \
    wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    apt-get update && \
    apt-get install -yqq nodejs && \
    npm i -g npm@^8 && \
    rm -rf /var/lib/apt/lists/*

# Install ImageMagick
RUN \
    wget https://dist.1-2.dev/imei.sh && \ 
    chmod +x imei.sh && \
    ./imei.sh --skip-jxl --skip-heif --skip-aom

# Copy Files
COPY . .

# Install dependencies
RUN npm install

# Start app
CMD ["npm", "start"]
