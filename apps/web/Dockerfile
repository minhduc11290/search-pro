FROM node:23-alpine
WORKDIR /app

COPY package.json ./

RUN npm install -g pnpm && pnpm install

COPY . .

RUN pnpm run build

EXPOSE 4173
CMD ["pnpm", "preview" , "--host", "0.0.0.0"]