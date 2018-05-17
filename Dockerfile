FROM node:9.11.1-alpine
WORKDIR /app
COPY . .
RUN npm install --no-dev
EXPOSE 3003
CMD ["node", "index.js"]
