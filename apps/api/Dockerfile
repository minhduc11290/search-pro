FROM node:23-alpine
WORKDIR /app
COPY package.json ./

RUN npm install -g pnpm

COPY  . .
RUN pnpm install
RUN pnpm run build
# RUN pnpm run db:reset

# RUN pnpm run build

EXPOSE 5000

CMD ["pnpm", "start"]