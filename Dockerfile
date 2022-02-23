# From node slim image
# https://stackoverflow.com/a/71073989
FROM node:17.0.0-slim
WORKDIR /app

# Install dependencies
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -qq update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -qq upgrade
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -qq install python
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -qq install python3
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -qq install webp
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -qq imagemagick 

# Copy Files
COPY . .

# Install dependencies
RUN npm install

# Start app
CMD ["npm", "start"]
