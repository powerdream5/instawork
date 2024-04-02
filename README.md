## Overview

This repository hosts the source code for a compact team member management application, split into frontend and backend services. The backend, created with the Django framework, offers RESTful APIs. In contrast, the frontend is developed with Next.js, a React framework for server-side rendering and static site generation.

## Architecture

The application is structured into three main directories:

- `backend/` - Contains all the Django backend code, including models, views, and APIs necessary for the application's functionality.
- `frontend/` - Houses the Next.js frontend application, including pages, components, and styles for the user interface.
- `docker-compose.yml` - Defines the services and volumes that are necessary to run the application in containers, ensuring easy deployment and development.

## Starting the Application
With Docker and Docker Compose installed, you can start the application using the following command:
```bash
docker-compose up --build
```

## API Documentation
The backend API endpoints are documented using Swagger/OpenAPI. After starting the application, you can access the API documentation at [http://localhost:8000/swagger](http://localhost:8000/swagger/).





