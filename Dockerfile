# From node slim image
# https://stackoverflow.com/a/71073989
FROM python:slim-buster
WORKDIR /app

# Install dependencies based on https://github.com/nikolaik/docker-python-nodejs
RUN \
    apt-get update && \
    apt-get install -yqq gnupg wget curl && \
    echo "deb https://deb.nodesource.com/node_16.x buster main" > /etc/apt/sources.list.d/nodesource.list && \
    wget -qO- https://deb.nodesource.com/gpgkey/nodesource.gpg.key | apt-key add - && \
    apt-get update && \
    apt-get install -yqq nodejs && \
    npm i -g npm@^8 && \
    t=$(mktemp) && \
    wget 'https://dist.1-2.dev/imei.sh' -qO "$t" && \
    bash "$t" && \
    rm "$t" && \
    rm -rf /var/lib/apt/lists/*

# Copy Files
COPY . .

# Install dependencies
RUN npm install

# Start app
CMD ["npm", "start"]
