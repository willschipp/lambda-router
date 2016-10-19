FROM iron/node
WORKDIR /app
ADD . /app
EXPOSE 80
ENTRYPOINT ["node","index.js"]
