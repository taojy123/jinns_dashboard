FROM node:8.9.4
MAINTAINER tao(taojy123@163.com)

RUN mkdir /workspace/ -p
COPY . /workspace/
WORKDIR /workspace/

RUN npm config set registry https://registry.npm.taobao.org

RUN npm install

ENV API_URL https://jinns.top
ENV API_URL_BROWSER https://jinns.top
RUN npm run build

CMD npm start
