# base image
FROM node:20-alpine

# set working directory
WORKDIR /app

# copy dependency files
COPY package*.json ./

# install dependencies
RUN npm install

# copy the rest of the project
COPY . .

# build the project
RUN npm run build

# expose the port (default for Next.js)
EXPOSE 3000

# run Next.js in production mode
CMD ["npm", "run", "start"]