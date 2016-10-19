FROM iron/node:dev
WORKDIR /app
ADD . /app
RUN npm install
EXPOSE 80
ENTRYPOINT ["node","index.js"]
