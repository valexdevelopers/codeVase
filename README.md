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

CodeVase API Documentation
Overview

The CodeVase API is a comprehensive solution for managing an online code editor platform. It allows for user registration, task management, code execution, and feedback provision. This documentation provides detailed information on the API endpoints, their usage, and the data models used.
Table of Contents

    Authentication
    User Management
    Task Management
    Code Execution
    Feedback Management
    Admin Operations
    Data Models

Authentication
Register

    Endpoint: /auth/register
    Method: POST
    Description: Registers a new user (either admin or regular user).
    Request Body:
```bash
    json

    {
      "username": "string",
      "password": "string",
      "email": "string",
      "role": "user | admin"
    }

Login

    Endpoint: /auth/login
    Method: POST
    Description: Logs in a user and returns a JWT token.
    Request Body:

    json

    {
      "username": "string",
      "password": "string"
    }

Verify Account

    Endpoint: /auth/verify
    Method: POST
    Description: Verifies a user's account (admin only).
    Request Body:

    json

    {
      "userId": "string"
    }
```
User Management
Get User Details

    Endpoint: /users/{userId}
    Method: GET
    Description: Retrieves details of a specific user.
    Path Parameters:
        userId: The ID of the user.

Get All Users

    Endpoint: /users
    Method: GET
    Description: Retrieves a list of all users (admin only).

Task Management
Create Task

    Endpoint: /tasks
    Method: POST
    Description: Creates a new task (admin only).
    Request Body:
```bash
    json

    {
      "title": "string",
      "description": "string",
      "inputFormat": "string",
      "outputFormat": "string"
    }

Get All Tasks

    Endpoint: /tasks
    Method: GET
    Description: Retrieves a list of all tasks.

Get Task Details

    Endpoint: /tasks/{taskId}
    Method: GET
    Description: Retrieves details of a specific task.
    Path Parameters:
        taskId: The ID of the task.

Code Execution
Run Code

    Endpoint: /code/run
    Method: POST
    Description: Runs the submitted code and returns the result.
    Request Body:

    json

    {
      "taskId": "string",
      "code": "string"
    }

Save Code

    Endpoint: /code/save
    Method: POST
    Description: Saves the submitted code.
    Request Body:

    json

    {
      "taskId": "string",
      "code": "string"
    }
```
Feedback Management
Get Feedback

    Endpoint: /feedback/{taskId}
    Method: GET
    Description: Retrieves feedback for a specific task.
    Path Parameters:
        taskId: The ID of the task.

Admin Operations
View All Tasks

    Endpoint: /admin/tasks
    Method: GET
    Description: Admin view to see all tasks and the number of times each task was attempted.

View All Users

    Endpoint: /admin/users
    Method: GET
    Description: Admin view to see all users and their details.

View User Task Attempts

    Endpoint: /admin/users/{userId}/tasks
    Method: GET
    Description: Admin view to see the number of times a user attempted each task.
    Path Parameters:
        userId: The ID of the user.

Data Models
User
```bash
json

{
  "id": "string",
  "username": "string",
  "email": "string",
  "role": "user | admin",
  "verified": "boolean"
}

Task

json

{
  "id": "string",
  "title": "string",
  "description": "string",
  "inputFormat": "string",
  "outputFormat": "string"
}

Code

json

{
  "taskId": "string",
  "userId": "string",
  "code": "string",
  "timestamp": "datetime"
}

Feedback

json

{
  "taskId": "string",
  "userId": "string",
  "result": "string",
  "timestamp": "datetime"
}


Error Handling

All endpoints return standard HTTP status codes along with error messages in the following format:

json
```baash
{
  "error": "string",
  "message": "string"
}
```
Common Status Codes

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

- Author - [Egerega Virtue](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
