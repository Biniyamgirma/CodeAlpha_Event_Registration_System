# Event Registration System

## Description

This is a backend system for managing event registrations. It provides APIs for user authentication, event creation, registration, and more.

## Features

*   User registration and authentication (JWT)
*   Event management (create, read, update, delete events)
*   Sponsor management
*   Session management
*   Discount and ticket management
*   Event registration

## Technologies Used

*   Node.js
*   Express.js
*   PostgresSQL
*   JSON Web Tokens (JWT)
*   multer
*   bcrypt
*   pg
*   dotenv

## Installation

1.  Clone the repository:

    ```bash
    git clone [https://github.com/Biniyamgirma/CodeAlpha_Event_Registration_System.git
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Configure the environment:

    *   Create a `.env` file based on `.env.example` 
    *   Set the necessary environment variables (e.g., database connection details, JWT secret).  Example:

        ```
        PORT=3030
        SUPER_SECRET_CODE=your_secret_code
        ```

4.  Set up the database:

    *   Create a PostgresSql database.
    *   Connet to the `database` file:


5.  Start the server:

    ```bash
    npm start
    ```

## API Endpoints

| Endpoint          | Method | Description                     | Request Body                     | Response                                     |
| :---------------- | :----- | :------------------------------ | :------------------------------- | :------------------------------------------- |
| `/events`         | GET    | Get all events                  | None                             | JSON array of event objects                 |
| `/register`        | POST   | Register a user for an event    | `{ userId, eventId }`           | Success/error message                      |
| `/auth/signup`   | POST   | Register a new user             | `{ email, password }`          | JWT token                                  |
| `/auth/signin`   | POST   | Authenticate an existing user    | `{ email, password }`          | JWT token                                  |

See the [API Documentation](#api-documentation) for a complete list of endpoints.

## API Documentation

[Link to your API documentation (e.g., openapi: 3.0.0
info:
  title: Event Registration API
  version: 1.0.0
servers:
  - url: http://localhost:3030/  # Update with your server URL

paths:
  /events:
    get:
      summary: Get all events
      responses:
        '200':
          description: Successful operation
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                      description: Event ID
                    name:
                      type: string
                      description: Event Name
                    description:
                      type: string
                      description: Event Description
                    date:
                      type: string
                      format: date
                      description: Event Date
  /register:
    post:
      summary: Register user to event
      requestBody:
        required: true
        content:
            application/json:
              schema:
                type: object
                properties:
                  userId:
                    type: integer
                    description: User ID
                  eventId:
                    type: integer
                    description: Event ID
      responses:
        '200':
          description: User registration successful
        '400':
          description: Bad request
)](link-to-your-swagger-ui)

## Contributing

None

## License

[ MIT License]
