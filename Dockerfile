FROM node:8.9.4
MAINTAINER XD(dxd.spirits@gmail.com)

RUN mkdir /workspace/ -p
COPY . /workspace/
WORKDIR /workspace/

RUN npm install

ENV API_URL https://heidianapi.com/api/
ENV API_URL_BROWSER https://heidianapi.com/api/
RUN npm run build

CMD npm start
