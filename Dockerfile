FROM node:8.9.4
MAINTAINER XD(xd@hey.shop)

RUN mkdir /workspace/ -p
COPY . /workspace/
WORKDIR /workspace/

RUN npm install

ENV API_URL https://mhdchina.heidianer.com/api/
ENV API_URL_BROWSER https://mhdchina.heidianer.com/api/
RUN npm run build

CMD npm start
