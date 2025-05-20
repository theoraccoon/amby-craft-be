FROM node:23.11.1-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start:prod"]