FROM node:22-alpine

WORKDIR /app
COPY cockpit ./cockpit
COPY server/server.js ./server/server.js
COPY server/apply-batch.js ./server/apply-batch.js

USER node
EXPOSE 8096
CMD ["node", "server/server.js"]
