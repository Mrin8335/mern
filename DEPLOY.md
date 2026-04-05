# Deployment Guide

This guide provides instructions for deploying the application using GitHub Actions, Docker, Nginx, and MongoDB Atlas.

<<<<<<< HEAD
## Prerequisites
=======
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  Create a new cluster.
3.  In your cluster, go to the "Database" section and click on the "Connect" button.
4.  Select "Drivers" as the connection method.
5.  Select "Node.js" as the driver and the latest version.
6.  You will see a connection string that looks like this: `mongodb+srv://mrinmoybhuiya88_db_user:Windows10@webpage.uklqhey.mongodb.net/?appName=webpage`
7.  Replace the connection string with the one provided above if it's not already.
8.  This connection string is your `MONGO_URI`.
>>>>>>> 778b49c98bb87cd321300c2490d790fc2bda0f7b

- A GitHub account and repository for the project.
- Docker and Docker Compose installed on your deployment server.
- A MongoDB Atlas account and cluster.
- A server (e.g., AWS EC2, DigitalOcean Droplet) with Ubuntu or similar Linux distribution.

## MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2. Create a new cluster (M0 tier is free).
3. In the cluster dashboard, click "Connect" > "Drivers".
4. Select "Node.js" as the driver and copy the connection string.
5. Replace `<username>` and `<password>` with your database user credentials.
6. Whitelist your server's IP address in the Network Access section (or 0.0.0.0/0 for testing, but restrict for production).

The connection string will look like: `mongodb+srv://<username>:<password>@cluster.mongodb.net/?retryWrites=true&w=majority`

## Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

<<<<<<< HEAD
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/database_name
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=production
```

## Docker Setup

The project includes Dockerfiles for both frontend and backend, and a `docker-compose.yml` for orchestration.

### Building Images Locally (Optional)

```bash
# Build frontend
cd frontend
docker build -t your-app-frontend .

# Build backend
cd ../backend
docker build -t your-app-backend .
```

## Nginx Configuration

The `nginx.conf` file is configured as a reverse proxy. It forwards requests to the appropriate services:

- Frontend: `/` (served by Vite dev server or built static files)
- Backend API: `/api/*`

Update the `nginx.conf` if needed for your domain or SSL setup.

## GitHub Actions Deployment

Create a GitHub Actions workflow to automate deployment:

1. In your GitHub repository, create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v3

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2

    - name: Log in to Docker Hub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}

    - name: Build and push frontend
      uses: docker/build-push-action@v4
      with:
        context: ./frontend
        push: true
        tags: your-dockerhub-username/your-app-frontend:latest

    - name: Build and push backend
      uses: docker/build-push-action@v4
      with:
        context: ./backend
        push: true
        tags: your-dockerhub-username/your-app-backend:latest

    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.10
      with:
        host: ${{ secrets.SERVER_HOST }}
        username: ${{ secrets.SERVER_USERNAME }}
        key: ${{ secrets.SERVER_SSH_KEY }}
        script: |
          cd /path/to/your/app
          docker-compose pull
          docker-compose up -d --build
```

2. Add the following secrets to your GitHub repository:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token
   - `SERVER_HOST`: Your server's IP address or domain
   - `SERVER_USERNAME`: SSH username for your server
   - `SERVER_SSH_KEY`: Private SSH key for authentication

## Server Setup

On your deployment server:

1. Install Docker and Docker Compose:

```bash
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker
```

2. Clone your repository:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

3. Create the `.env` file in `backend/` with your environment variables.

4. Run the application:

```bash
docker-compose up -d --build
```

5. The application should be accessible at your server's IP address.

## SSL Configuration (Optional)

To enable HTTPS, you can use Let's Encrypt with Certbot:

1. Install Certbot:

```bash
sudo apt install certbot python3-certbot-nginx
```

2. Obtain SSL certificate:

```bash
sudo certbot --nginx -d yourdomain.com
```

3. Update `nginx.conf` to redirect HTTP to HTTPS if needed.

## Monitoring and Maintenance

- Monitor logs: `docker-compose logs -f`
- Update the application: Push to main branch, GitHub Actions will handle deployment
- Backup MongoDB Atlas data regularly through the Atlas dashboard

## Troubleshooting

- Ensure all environment variables are set correctly
- Check Docker container logs: `docker-compose logs <service-name>`
- Verify MongoDB Atlas connection string and network access
- Confirm Nginx configuration is correct
=======
1.  Create a new site on Netlify from your Git repository.
2.  Netlify will automatically detect and use the `netlify.toml` file for the build settings.
3.  You will need to set the following environment variables in the Netlify dashboard:
    *   `MONGO_URI`: The connection string for your MongoDB Atlas database. See the "MongoDB Atlas Setup" section above.
    *   `JWT_SECRET`: A secret key for signing JSON Web Tokens.
    *   `VITE_API_URL`: The URL of your backend API. This should be the URL of your Netlify site, e.g., `https://your-site.netlify.app/api`.

## Docker Compose

The project includes a `docker-compose.yml` file for easy deployment using Docker. The configuration includes services for the frontend, backend, MongoDB, and an Nginx reverse proxy.

To deploy using Docker Compose:

1.  Make sure you have [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed on your server or local machine.
2.  Clone the repository and navigate to the project root directory.
3.  Create a `.env` file in the `backend` directory with your required environment variables (e.g., `JWT_SECRET`).
4.  Run the following command to build and start the containers in detached mode:
    ```bash
    docker-compose up -d --build
    ```
5.  The application will be accessible at `http://localhost` (or your server's IP address) via the Nginx reverse proxy.
>>>>>>> 778b49c98bb87cd321300c2490d790fc2bda0f7b
