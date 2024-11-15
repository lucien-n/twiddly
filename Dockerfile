FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile --prod

COPY . .

RUN pnpm prisma generate
RUN pnpm build

EXPOSE 3000

CMD ["node", "build/index.js"]