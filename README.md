This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### Local Development

#### Prerequisites

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

#### Using the Docker Environment

We've included a helper script `docker-dev.sh` to manage the Docker environment:

```bash
# Start the development environment
./docker-dev.sh start

# View logs
./docker-dev.sh logs

# Open a shell in the app container
./docker-dev.sh shell

# Open PostgreSQL CLI
./docker-dev.sh db

# Stop the environment
./docker-dev.sh stop

# Rebuild containers
./docker-dev.sh build

# Remove containers and volumes (deletes database data)
./docker-dev.sh clean
```

### Docker Development Environment

This project includes a Docker Compose setup for development that runs both the Bun/Next.js application and a PostgreSQL database.

#### Environment Configuration

The Docker setup uses the following configuration:

- **Next.js App**: Runs on http://localhost:3000
- **PostgreSQL**:
  - Host: localhost
  - Port: 5432
  - Username: postgres
  - Password: postgres
  - Database: doc_processor

#### Prisma Integration

The Docker setup automatically:
- Generates the Prisma client
- Runs migrations on startup
- Connects to the PostgreSQL database

The database schema is defined in `prisma/schema.prisma` and can be modified as needed.

#### Docker Compose Configuration Details

The `docker-compose.yml` file defines two services:

1. **app**: The Bun/Next.js application
   - Built from the local Dockerfile
   - Maps port 3000 to localhost:3000
   - Mounts the project directory as a volume for hot reloading
   - Depends on the database service
   - Automatically runs Prisma migrations on startup

2. **db**: PostgreSQL database
   - Uses the official PostgreSQL 16 Alpine image
   - Maps port 5432 to localhost:5432
   - Stores data in a named volume for persistence
   - Configured with environment variables for username, password, and database name

**Volumes**:
- The project directory is mounted into the app container to enable hot reloading
- A named volume `postgres_data` is used to persist the database between container restarts

**Environment Variables**:
- The app container uses the `DATABASE_URL` environment variable to connect to PostgreSQL
- The database container is configured with `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`

**Development Workflow**:
1. Code changes in the project directory are immediately reflected in the running app
2. Database changes require Prisma migrations (can be run with `docker-compose exec app bunx prisma migrate dev`)
3. The database data persists even when containers are stopped (unless you run `./docker-dev.sh clean`)

#### Switching Database Providers

The project is configured to use PostgreSQL by default, but Prisma supports multiple database providers. To switch:

1. **Update the Prisma schema**:
   Edit `prisma/schema.prisma` and change the provider:
   ```prisma
   datasource db {
     provider = "postgresql" // Change to "mysql", "sqlite", "mongodb", etc.
     url      = env("DATABASE_URL")
   }
   ```

2. **Update the .env file**:
   The `.env` file contains commented examples for different database connection strings:

   ```
   # PostgreSQL connection string (default)
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/doc_processor?schema=public"
   ```

3. **Update docker-compose.yml**:
   If switching database providers, you'll need to update the `db` service in `docker-compose.yml` to use the appropriate database image and configuration.

4. **Generate Prisma client**:
   After changing the provider, regenerate the Prisma client:
   ```bash
   bunx prisma generate
   ```

5. **Create migrations**:
   ```bash
   bunx prisma migrate dev --name init
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
