# to build the dist for frontend
FROM node:20-alpine as base
WORKDIR /
COPY /ui /ui
COPY ./core ./core
WORKDIR /ui
RUN npm i
RUN npm run build

# to run
FROM node:20-alpine as final
WORKDIR /
COPY --from=base /core /core
WORKDIR /core
RUN npm i
CMD [ "npm","run","prod" ]