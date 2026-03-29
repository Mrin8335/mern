# MongoDB Atlas Setup

To use MongoDB Atlas as your database, you need to create a free account and a new cluster. Once you have created the cluster, you can get the connection string.

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  Create a new cluster.
3.  In your cluster, go to the "Database" section and click on the "Connect" button.
4.  Select "Drivers" as the connection method.
5.  Select "Node.js" as the driver and the latest version.
6.  You will see a connection string that looks like this: `mongodb+srv://<username>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority`
7.  Replace `<username>`, `<password>`, `<cluster-url>`, and `<database-name>` with your actual credentials and database name.
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
