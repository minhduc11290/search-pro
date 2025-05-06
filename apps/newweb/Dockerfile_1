FROM node:23-alpine
WORKDIR /app

# COPY package.json ./
COPY . .

RUN npm install -g pnpm && pnpm install
# RUN npm install -g yarn && yarn install
# RUN npm install -g yarn
RUN  pnpm install

# COPY . .

RUN pnpm run build

EXPOSE 3000
# CMD ["pnpm", "preview" , "--host", "0.0.0.0"]
CMD ["pnpm", "start"]
# CMD ["sh", "-c", "pnpm build && pnpm start"]