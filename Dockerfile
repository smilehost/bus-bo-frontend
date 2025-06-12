# base image
FROM node:20-alpine

# set working directory
WORKDIR /app

# set environment variables
ENV NODE_ENV=NODE_ENV
ENV NEXT_PUBLIC_API_URL=NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CONTEXT_PATH=NEXT_PUBLIC_CONTEXT_PATH
ENV NEXT_PUBLIC_JWT_SECRET=NEXT_PUBLIC_JWT_SECRET

# copy dependencies
COPY package*.json ./
RUN npm install

# copy source code
COPY . .

COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

# build Next.js
RUN npm run build

EXPOSE 3000


# run in production
CMD ["npm", "run", "start"]