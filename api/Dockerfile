# Use the official Node.js LTS (Long Term Support) as the base image
FROM node:lts

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy the application source code
COPY . .

# Build the application
RUN yarn run build

# Set environment variables
ARG DATABASE_URL
ARG PORT
ARG HASH_SALT
ARG JWT_SECRET

# Expose the port the app will run on
EXPOSE ${PORT}

# Start the application
CMD ["yarn", "run", "start"]