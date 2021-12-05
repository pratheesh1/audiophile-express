# 1. Route Controller Functions

## This directory contains the route controller functions for the application.

### 1.1 Documentation

- [Express.js](https://expressjs.com/en/4x/api.html)
- [Express.js Router](https://expressjs.com/en/4x/api.html#router)

### 1.2 Route Controller Functions

This project has routes for server-side rendered pages and api routes for a react front-end. All controllers for api routes are in the `api` directory and all controllers for server side routes are in the `http` directory. Controllers for routes that doesn't fit either category are in the root directory.

### 1.3 Directory Structure

```
├── api
│   ├── address.api.controllers.js
│   ├── cart.api.controllers.js
│   ├── checkout.api.controller.js
│   ├── order.api.controllers.js
│   ├── product.api.controllers.js
│   └── user.api.controllers.js
├── cloudinary.controllers.js
├── http
│   ├── order.http.controllers.js
│   ├── product.http.controllers.js
│   └── user.http.controllers.js
├── README.md
└── stripe.controllers.js
```

- Controllers for cloudinary image upload api are in the `cloudinary.controllers.js` file.
- Controllers for stripe api are in the `stripe.controllers.js` file.
