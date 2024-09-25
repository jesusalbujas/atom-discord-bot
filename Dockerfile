# Use the official Node.js 20 image
FROM node:20

# Create a directory for your application
WORKDIR /usr/src/

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code into the working directory
COPY . .

# Start the bot
CMD ["node", "src/index.js"]
