# From node slim image
FROM node:slim
WORKDIR /app

# Update apt packages and install python
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y update 
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y upgrade
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y python imagemagick

# Copy Files
COPY . .

# Install dependencies
RUN npm install

# Expose app
CMD ["npm", "start"]