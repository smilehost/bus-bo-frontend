# =============================
# 🔨 BUILD STAGE (เร็ว + แยก dev dep)
# =============================
FROM node:20-alpine AS builder

WORKDIR /app

# set environment variables (placeholder ตามที่ขอ)
ENV NODE_ENV=NODE_ENV
ENV NEXT_PUBLIC_API_URL=NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CONTEXT_PATH=NEXT_PUBLIC_CONTEXT_PATH
ENV NEXT_PUBLIC_JWT_SECRET=NEXT_PUBLIC_JWT_SECRET

# copy only package files first (ใช้ layer cache ได้)
COPY package*.json ./
RUN npm install

# copy source code
COPY . .

# build Next.js project
RUN npm run build

# =============================
# 🚀 PRODUCTION STAGE (เล็ก เร็ว)
# =============================
FROM node:20-alpine

WORKDIR /app

# copy env placeholders (ตามเงื่อนไข)
ENV NODE_ENV=NODE_ENV
ENV NEXT_PUBLIC_API_URL=NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_CONTEXT_PATH=NEXT_PUBLIC_CONTEXT_PATH
ENV NEXT_PUBLIC_JWT_SECRET=NEXT_PUBLIC_JWT_SECRET

# copy built app only
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/entrypoint.sh ./entrypoint.sh

# install only production deps
RUN npm install --omit=dev

# copy entrypoint
COPY entrypoint.sh /usr/bin/
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["entrypoint.sh"]

EXPOSE 3000

CMD ["npm", "run", "start"]