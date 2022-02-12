# From node slim image
# https://stackoverflow.com/a/71073989
FROM nikolaik/python-nodejs:python3.10-nodejs16-slim
WORKDIR /app

# Install dependencies
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -qq update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y -qq upgrade
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y -qq imagemagick

# Copy Files
COPY . .

# Install dependencies
RUN npm install

# Expose app
CMD ["npm", "start"]