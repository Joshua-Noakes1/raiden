# From node slim image
FROM node:slim
WORKDIR /app

# Update apt packages and install python
RUN apt-get update -y && apt-get upgrade -y && apt-get install -y software-properties-common && apt-get install -y python

# Copy Files
COPY . .

# Install dependencies
RUN npm install

# Expose app
CMD ["npm", "start"]