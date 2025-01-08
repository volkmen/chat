# Stage 1: Build the app
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package*.json ./

# Install dependencies
RUN yarn install

# Copy the rest of the application files
COPY . .

# Build the app
RUN yarn build

# Stage 2: Create the production image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/build /app
COPY --from=build /app/package*.json /app/

# Install only production dependencies
RUN yarn install --production

# Expose the port the app runs on
EXPOSE 4000

# Start the app
CMD ["node", "index.js"]
