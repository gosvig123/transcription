# Use the official Node.js image as the base image
FROM node:14

# Set the working directory
WORKDIR /client

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the client source
COPY . .

# Build the app
RUN npm run build

# Serve the build using a lightweight server (e.g., serve)
RUN npm install -g serve

# Expose the port
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]
