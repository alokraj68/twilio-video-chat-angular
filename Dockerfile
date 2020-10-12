ARG NODE_VERSION=12

FROM node:${NODE_VERSION}-alpine AS build-stage

WORKDIR /api
ENV PATH /api/node_modules/.bin:$PATH

COPY package.json .
RUN npm install

COPY . .

ARG configuration=staging

RUN npm run build -- --output-path=./dist --configuration=$configuration

ENTRYPOINT [ "npm" ]

FROM nginx:1.16.0-alpine

COPY --from=build-stage /api/dist/ /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
