# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the NestJS app
RUN npm run build

# Expose the port (default for NestJS is 3000)
EXPOSE 3000

# Command to run the app
CMD ["npm", "run", "start:dev"]
