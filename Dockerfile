# From node slim image
FROM node:slim
WORKDIR /app

# Update apt packages and install python
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -qq update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -qq upgrade
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -qq python imagemagick

# Copy Files
COPY . .

# Install dependencies
RUN npm install

# Fix for ytdlp running
RUN DEBIAN_FRONTEND=noninteractive apt-get remove -y -qq python
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -qq python3

# Expose app
CMD ["npm", "start"]