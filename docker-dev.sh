#!/bin/bash

# Make this script executable with: chmod +x docker-dev.sh

case "$1" in
  start)
    echo "Starting Docker development environment..."
    docker compose up -d --build
    echo "Docker containers started in detached mode."
    echo "App is running at http://localhost:3000"
    echo "PostgreSQL is available at localhost:5432"
    echo "Use './docker-dev.sh logs' to see logs."
    ;;
  stop)
    echo "Stopping Docker development environment..."
    docker compose down
    echo "Docker containers stopped."
    ;;
  restart)
    echo "Restarting Docker development environment..."
    docker compose down
    docker compose up -d --build
    echo "Docker containers restarted."
    ;;
  logs)
    echo "Showing logs (Ctrl+C to exit)..."
    docker compose logs -f
    ;;
  build)
    echo "Rebuilding Docker images..."
    docker compose build
    echo "Docker images rebuilt."
    ;;
  clean)
    echo "Cleaning up Docker environment (will remove database data)..."
    docker compose down -v
    echo "Docker environment cleaned."
    ;;
  shell)
    echo "Opening shell in app container..."
    docker compose exec app /bin/sh
    ;;
  db)
    echo "Opening PostgreSQL CLI..."
    docker compose exec db psql -U postgres -d doc_processor
    ;;
  *)
    echo "Usage: $0 {start|stop|restart|logs|build|clean|shell|db}"
    echo ""
    echo "Commands:"
    echo "  start   - Start the development environment"
    echo "  stop    - Stop the development environment"
    echo "  restart - Restart the development environment"
    echo "  logs    - Show logs from all containers"
    echo "  build   - Rebuild Docker images"
    echo "  clean   - Remove containers and volumes (deletes database data)"
    echo "  shell   - Open a shell in the app container"
    echo "  db      - Open PostgreSQL CLI"
    exit 1
    ;;
esac

exit 0
