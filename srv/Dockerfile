FROM node:11.11
WORKDIR /app
COPY package.json ./
RUN yarn
COPY . ./

EXPOSE 3001
CMD ["node", "index.js"]