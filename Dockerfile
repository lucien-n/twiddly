FROM node:20-alpine

WORKDIR /app

# on ne copie d'abord que le package et le lock pour optimiser l'utilisation cache
#   => docker cache chaque etapes
COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm prisma generate

EXPOSE 5173

CMD ["pnpm", "dev"]
