FROM node:16.13-alpine3.13

RUN apk add udev ttf-freefont chromium git
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY . /app
WORKDIR /app
RUN yarn install --non-interactive
RUN yarn build

CMD yarn start
