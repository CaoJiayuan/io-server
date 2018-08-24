FROM node:9.11.1-alpine
WORKDIR /app
COPY . .
RUN cp .env.example .env && npm install --no-dev
EXPOSE 3003
CMD ["node", "index.js"]
