# MongoDB Atlas Setup

To use MongoDB Atlas as your database, you need to create a free account and a new cluster. Once you have created the cluster, you can get the connection string.

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  Create a new cluster.
3.  In your cluster, go to the "Database" section and click on the "Connect" button.
4.  Select "Drivers" as the connection method.
5.  Select "Node.js" as the driver and the latest version.
6.  You will see a connection string that looks like this: `mongodb+srv://mrinmoybhuiya88_db_user:Windows10@webpage.uklqhey.mongodb.net/?appName=webpage`
7.  Replace the connection string with the one provided above if it's not already.
8.  This connection string is your `MONGO_URI`.

# Deployment Instructions

## Render

The project is already configured for deployment on Render using the `render.yaml` file. To deploy to Render, you need to:

1.  Create a new "Blueprint" service on Render.
2.  Connect your Git repository.
3.  Render will automatically detect and use the `render.yaml` file to configure the services.
4.  You will need to set the following environment variables in the Render dashboard for the backend service:
    *   `MONGO_URI`: The connection string for your MongoDB Atlas database. See the "MongoDB Atlas Setup" section above.
    *   `JWT_SECRET`: A secret key for signing JSON Web Tokens.

## Netlify

The project is now configured for deployment on Netlify using the `netlify.toml` file. To deploy to Netlify, you need to:

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
