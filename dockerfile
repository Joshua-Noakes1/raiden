# https://stackoverflow.com/a/71073989
FROM python:alpine3.16
WORKDIR /app

# Install NodeJS
RUN apk update
RUN apk add --no-cache nodejs npm imagemagick

# Copy Files
COPY . .

# Install dependencies
RUN npm install

# Start app
CMD ["npm", "start"]
