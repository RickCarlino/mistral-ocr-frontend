FROM oven/bun:latest

WORKDIR /app

# Copy package.json and bun.lock
COPY package.json bun.lock ./

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Generate Prisma client
RUN bunx prisma generate

# Create uploads directory
RUN mkdir -p public/uploads

# Expose the port the app will run on
EXPOSE 3000

# Start the application in development mode
CMD ["bun", "run", "dev"]
