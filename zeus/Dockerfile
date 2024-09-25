FROM node:20

# Create the bot's directory
RUN mkdir -p /usr/src/bot
WORKDIR /usr/src/bot

COPY package.json /usr/src/bot
RUN npm install && npm install discord.js@latest

COPY . /usr/src/bot

# Start the bot.
CMD ["node", "index.js"]