# base image
FROM node:20-alpine

# set working directory
WORKDIR /app

# copy dependencies
COPY package*.json ./
RUN npm install

# copy source code
COPY . .

# build Next.js
RUN npm run build

EXPOSE 3000

# run in production
CMD ["npm", "run", "start"]