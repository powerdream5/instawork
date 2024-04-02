## Overview

This repository hosts the source code for a compact team member management application, split into frontend and backend services. The backend, created with the Django framework, offers RESTful APIs. In contrast, the frontend is developed with Next.js, a React framework for server-side rendering and static site generation.

## Architecture

The application is structured into three main directories:

- `backend/` - Contains all the Django backend code, including models, views, and APIs necessary for the application's functionality.
- `frontend/` - Houses the Next.js frontend application, including pages, components, and styles for the user interface.
- `docker-compose.yml` - Defines the services and volumes that are necessary to run the application in containers, ensuring easy deployment and development.

## Development

### Prerequisites

- Docker and Docker Compose
- Node.js (version >= 20) for frontend development and execution.
- Python 3.10 (for backend development)
  
### Setup

1. **Clone the Repository**
```bash
git clone https://github.com/powerdream5/instawork.git
cd instawork
```

2. **Setup Frontend Dependencies**

Before running the application, ensure the frontend dependencies are installed. Navigate to the `frontend` directory and install the required packages:
```bash
cd frontend
npm install
```
**Note:** After the installation is complete, return to the root directory.
<br>

3. **Starting the Application**

With Docker and Docker Compose installed, you can start the application using the following command:
```bash
docker-compose up --build
```

4. **Accessing the Application**

After the application has started, you can access the frontend of the application by navigating to [http://localhost:3000](http://localhost:3000) in your web browser.

**Note:** The first time you try to access the application, if it does not load successfully, please refresh the page. This can happen as the frontend is still initializing.

## API Documentation
The backend API endpoints are documented using Swagger/OpenAPI. After starting the application, you can access the API documentation at [http://localhost:8000/swagger](http://localhost:8000/swagger/).





