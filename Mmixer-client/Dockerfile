FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

EXPOSE 3000

ENV NODE_ENV=development

CMD ["npm", "start"]