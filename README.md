# TalPets Frontend

## Table of Contents
- [How to run application](#how-to-run-application)
- [How to build a project](#how-to-build-a-project)
- [How to build and run docker container](#how-to-build-and-run-docker-container)
- [Technology stack listing](#technology-stack-listing)
- [Project introduction/purpose](#project-introductionpurpose)
- [Prerequisites/requirements](#prerequisitesrequirements)

---

## How to run application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

---

## How to build a project

### Clone the repository

```bash
git clone https://github.com/AnastassiyaR/talpets-frontend.git
```

### Install dependencies

```bash
npm install
```

### Production Build

Create an optimized production build:

```bash
npm run build
```

Build output will be generated in the `dist/` directory.

### Preview Production Build

Test the production build locally:

```bash
npm run preview
```

This serves the built files from `dist/` folder at `http://localhost:4173`

---

## How to build and run docker container

### Build Docker Image

```bash
docker build -t talpets-frontend:latest .
```

### Run Docker Container

```bash
docker run -d \
  -p 8080:80 \
  --name talpets-frontend \
  talpets-frontend:latest
```

Access the application at `http://localhost:8080`

### Docker Compose (Optional)

If you have `docker-compose.yml`:

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down
```

### Stop and Remove Container

```bash
docker stop talpets-frontend
docker rm talpets-frontend
```

---

## Technology stack listing

**Frontend:**
* HTML
* CSS
* JavaScript
* React.js
* Vite
* Axios

**Domain:**
* No-IP

---

## Project introduction/purpose

The frontend communicates with the backend API to display available products, manage user accounts, and process orders.  
It is built using modern web technologies for high performance and fast development.

---

## Prerequisites/requirements

Before you begin, ensure you have the following installed:

- **Node.js**: version 18.x or higher
- **npm**: version 9.x or higher (comes with Node.js)
- **Git**: for cloning the repository
- **Docker** (optional): version 20.x or higher for containerized deployment

To check your versions:
```bash
node --version
npm --version
git --version
docker --version
```
