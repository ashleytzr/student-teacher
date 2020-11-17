FROM node:12.16.3
WORKDIR /usr/app
COPY package.json .
COPY package-lock.json .
RUN npm install 
COPY . .