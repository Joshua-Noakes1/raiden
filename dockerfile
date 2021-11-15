# Node Image
FROM node
WORKDIR /usr/src/app

# Install deps
RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install python python3 -y

# Install dependencies
RUN npm install -g typescript ts-node

# install nodejs packages
COPY . .
RUN YOUTUBE_DL_SKIP_DOWNLOAD=true npm install --save

# Remove Python
RUN apt-get remove python python3 -y

# Run
CMD ["ts-node", "index.ts"]