FROM node:14-slim
WORKDIR /app
COPY package.json ./

RUN npm i

COPY src ./src
COPY public ./public
COPY tsconfig.json ./

RUN npm run build
RUN rm -rf node_modules
RUN npm i -g serve

CMD ["serve", "-s", "build"]