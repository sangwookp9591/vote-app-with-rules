# chat-server용 Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts
COPY . .
EXPOSE 5001
CMD ["node", "index.js"] 