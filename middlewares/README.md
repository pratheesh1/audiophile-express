# 1. Middlewares

## This directory contains custom middlewares for the application.

### 1.1 Middleware

- `errorHandler`

  This server handles errors globally. The `errorHandler` middleware is the first and only middleware to be executed if an error occurs in the application. A `500` page is rendered if an error occurs in an http route, and an appropriate json response is sent if an error occurs in an api route.

- Other middlewares

  This directory also contains other middlewares for `csrf`, and user authentication (This project uses `session` for server rendered routes, `jwt` for api routes).

### 1.2 Directory Structure

```
├── index.js
└── README.md
```
