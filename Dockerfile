FROM node:22-alpine
WORKDIR /app
COPY --chown=node:node package.json index.html styles.css script.js fortune.css fortune.js fortune-config.js ./
COPY --chown=node:node assets ./assets
COPY --chown=node:node server ./server
USER node
ENV PORT=3000
EXPOSE 3000
CMD ["node", "server/server.mjs"]
