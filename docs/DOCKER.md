# Docker Setup

This project includes Docker Compose configuration to run both the server and web client applications.

## Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)
- At least 2GB of available RAM

## Quick Start

1. **Build and start all services:**

   ```bash
   docker compose up --build
   ```

2. **Access the application:**

   - Web Client: http://localhost
   - Server API: http://localhost:3000
   - API Health Check: http://localhost:3000/

3. **Stop all services:**

   ```bash
   docker compose down
   ```

4. **Stop and remove volumes (clears database):**
   ```bash
   docker compose down -v
   ```

## Services

### Server

- **Port:** 3000
- **Database:** SQLite (persisted in Docker volume `server-data`)
- **Auto-seeding:** Enabled by default (set `SEED_DB=true` in docker-compose.yml)
- **Health Check:** Available at http://localhost:3000/

### Web Client

- **Port:** 80
- **Build-time API URL:** Configured via `VITE_API_URL` build arg
- **Default API URL:** http://localhost:3000/api/v1

## Environment Variables

### Server Environment Variables

You can override these in `docker-compose.yml`:

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (default: production)
- `DB_PATH` - Database file path (default: /app/data/inventory.db)
- `SEED_DB` - Seed database on startup (default: true)

### Web Build Arguments

You can override the API URL when building:

```yaml
web:
  build:
    args:
      - VITE_API_URL=http://your-api-url/api/v1
```

## Development vs Production

The Docker setup is configured for **production** mode:

- Server runs compiled JavaScript (not TypeScript)
- Web client is built and served via nginx
- Database is persisted in a Docker volume

For development, it's recommended to run the services locally:

- Server: `cd server && npm run dev`
- Web: `cd web && npm run dev`

## Troubleshooting

### Port Already in Use

If port 3000 or 80 is already in use, modify the port mappings in `docker-compose.yml`:

```yaml
ports:
  - "3001:3000" # Use 3001 instead of 3000
```

### Database Issues

The database is stored in a Docker volume. To reset it:

```bash
docker compose down -v
docker compose up --build
```

### Rebuild After Code Changes

After making code changes, rebuild the images:

```bash
docker compose up --build
```

### View Logs

```bash
# All services
docker compose logs

# Specific service
docker compose logs server
docker compose logs web

# Follow logs
docker compose logs -f
```
