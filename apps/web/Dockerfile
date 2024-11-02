FROM node:23-alpine
WORKDIR /app

COPY package.json ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

EXPOSE 5173
CMD ["pnpm", "preview"]