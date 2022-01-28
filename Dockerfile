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

# Expose app
CMD ["npm", "start"]