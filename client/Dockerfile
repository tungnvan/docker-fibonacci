FROM node:10.15-alpine AS build-stage
WORKDIR /app/client
COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN npm run build

FROM nginx:1.17.1
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/client/build /usr/share/nginx/html
