# From node slim image
FROM node:slim
WORKDIR /app

# Update apt packages and install python
RUN apt-get install -y -qq update 
RUN apt-get install -y -qq upgrade
RUN apt-get install -y -qq python imagemagick

# Copy Files
COPY . .

# Install dependencies
RUN npm install

# Expose app
CMD ["npm", "start"]