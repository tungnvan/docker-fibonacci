FROM node:10.15-alpine
WORKDIR /app/worker
COPY ./package.json ./
RUN npm install
COPY ./ ./
CMD ["npm", "run", "start"]