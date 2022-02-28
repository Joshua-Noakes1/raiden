# https://stackoverflow.com/a/71073989
FROM python:alpine3.15
WORKDIR /app

# Install NodeJS v16.x
RUN \
    apk update && \
    apk add nodejs npm && \
    apk add imagemagick && \
    rm -rf /var/cache/apk/*

# Copy Files
COPY . .

# Install dependencies
RUN npm install

# Start app
CMD ["npm", "start"]
