<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ yarn install
```

## ensure you have docker desktop running on your local machine

```bash
$ docker compose up 

$ yarn prisma generate deploy or dev 
```
##  Install all dependencies
2. Get docker running on your machine
3. run docker compose up
4. run prisma generate and migrate 
5. run your application 
## Running the app

```bash

# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## CodeVase API Documentation
Overview

The CodeVase API is a comprehensive solution for managing an online code editor platform. It allows for user registration, task management, code execution, and feedback provision. This documentation provides detailed information on the API endpoints, their usage, and the data models used.


## Table of Contents

1. Authentication
2. Verification
3. User Management
4. Task Management
5. Code Execution
6. Feedback Management
7. Admin Operations
8. Data Models



## CSRF Token 

1. Client Authorisation

    Endpoint: /user/auth/tokens/crsf_tokens
    Method: GET
    Description: Registers the client and attaches a token to the client.
    Request Body: None
    Response Body: true

## Authentication

## User

1. Register User

    Endpoint: /user/register
    Method: POST
    Description: Registers a new user only.
    Request Body:

```bash
    {
      "fullname": "string",
      "email": "string",
      "password": "string",
      "password_confirmation": "string",
     
    }
```
2. Login User

    Endpoint: /user/signin
    Method: POST
    Description: Logs in a user and returns a JWT token [accessToken-httpOnly-false and refreshTokens-httpOnly-true].
    Request Body:


```bash
    {
      "email": "string",
      "password": "string"
    }
```


3. Refresh User Login

    Endpoint: /user/auth/refresh/signin
    Method: POST
    Description: Refreshes a user login using a refreshToken and returns a JWT token [accessToken-httpOnly-false and refreshTokens-httpOnly-true].
    Request Body:


```bash
    {
      "refresh": "string" 
    }
```


## Verification

1.    Verify User Account

    Endpoint: /user/verify
    Method: POST
    Description: Verifies a user's account using a JWT token.
    Request Body:

```bash
    {
      "token": "string"
    }
```


2.   Resend Verification

  Endpoint: /user/resend-verification
    Method: POST
    Description: Refreshes the verification token and re-sends the user verification email.
    Request Body:

```bash
    {
      "userId": "string"
    }
```

## User Account Management

1. Get User Details

    Endpoint: /user/{userId}
    Method: GET
    Description: Retrieves details of a specific user.
    Path Parameters:
    userId: The ID of the user.

2. Get All Users

    Endpoint: /user/all
    Method: GET
    Description: Retrieves a list of all users (admin only).

## Task Management

1. Create Task

    Endpoint: /task/admin/create
    Method: POST
    Description: Creates a new task (admin only).
    Request Body:


```bash
    {
      "title": "string",
      "description": "string",
      "challenge": "string",
      "languages": "string",
      "level": "string",
    }
```

2. Get All Tasks

    Endpoint: /task/all
    Method: GET
    Description: Retrieves a list of all tasks.

3. Get Task Details

    Endpoint: /task/{taskId}
    Method: GET
    Description: Retrieves details of a specific task.
    Path Parameters:
        taskId: The ID of the task.

4. Update Task 
    Endpoint: /task/admin/{taskId}
    Method: PATCH
    Description: Retrieves details of a specific task.
    Path Parameters:
        taskId: The ID of the task.


5. Delete Task
    Endpoint: /task/admin/{taskId}/delete
    Method: DELETE
    Description: Retrieves details of a specific task.
    Path Parameters:
        taskId: The ID of the task.

1. Save Save Task Attempt, Code Execution Result

    Endpoint: /task/attempt/create
    Method: POST
    Description: Saves the submitted code. (users only)
    Request Body:

```bash

    {
      "challenge": "string", (takes challenge id)
      "user_code": "string",
      "code_stdin": "string",
      "code_execution_result": "string"
    }
```

## Admin Operations

1. View All Tasks

    Endpoint: /task/all
    Method: GET
    Description: Admin view to see all tasks.

2.  View All Users

    Endpoint: /user/admin/all
    Method: GET
    Description: Admin view to see all users and their details.

3. View User Task Attempts

    Endpoint: /user/{userId}
    Method: GET
    Description: Admin view to see the number of times a user attempted each task.
    Path Parameters:
        userId: The ID of the user.

## Data Models
1. User
2. Admin
3. TaskAttempt
4. Challenge


```bash

  {
    "id": "string",
    "username": "string",
    "email": "string",
    "role": "user | admin",
    "verified": "boolean"
  }
```

## Task
```bash
    {
    "id": "string",
    "title": "string",
    "description": "string",
    "inputFormat": "string",
    "outputFormat": "string"
    }

```
## Code

```bash
    {
    "taskId": "string",
    "userId": "string",
    "code": "string",
    "timestamp": "datetime"
    }
```
Feedback

```bash

    {
    "taskId": "string",
    "userId": "string",
    "result": "string",
    "timestamp": "datetime"
    }

```
##  Error Handling

 All endpoints return standard HTTP status codes along with error messages in the following format:


```bash
    {
    "error": "string",
    "message": "string"
    }
```
## Common Status Codes

    200 OK: Successful operation.
    201 Created: Resource successfully created.
    400 Bad Request: Invalid request parameters.
    401 Unauthorized: Authentication required or failed.
    403 Forbidden: Insufficient permissions.
    404 Not Found: Resource not found.
    500 Internal Server Error: Server encountered an error.

Conclusion

The CodeVase API provides a robust framework for managing an online code editor platform with features for user management, task management, code execution, and feedback provision. Admin functionalities include the ability to verify accounts, view all tasks and users, and monitor user activity. Use this documentation as a guide to integrate and utilize the API effectively.

## Stay in touch

- Author - [Egerega Virtue](https://egeregav.online)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
