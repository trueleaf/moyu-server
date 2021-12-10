FROM node:14.18.1-alpine AS builder

WORKDIR /opt/moyu-server
COPY ./package.json ./
COPY ./.npmrc ./
RUN npm install


FROM node:14.18.1-alpine

WORKDIR /opt/moyu-server
COPY ./ ./

RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories;\
  apk add --no-cache ca-certificates bash;\
  rm -rf ./node_modules .nuxt

COPY --from=builder /opt/moyu-server/node_modules ./node_modules

EXPOSE 7004
CMD npm run dev