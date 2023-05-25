# Use the official Node.js image as the base image
FROM node:14

# Set the working directory
WORKDIR /server

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the app source
COPY . .

# Expose the port
EXPOSE 8080

# Start the app
CMD ["npm", "start"]
