# Express Routes

## This directory contains all express routes for the application.

### 1.1 Documentation

- [Express.js](https://expressjs.com/en/4x/api.html)
- [Express.js Router](https://expressjs.com/en/4x/api.html#router)

### 1.2 Routes

This project has routes for server-side rendered pages and api routes for a react front-end. All api routes are in the `api` directory and all server-side routes are in the `http` directory. Some routes that doesn't fit either category are in the root directory.

### 1.3 Directory Structure

```
├── api
│   ├── address.api.routes.js
│   ├── cart.api.routes.js
│   ├── checkout.api.routes.js
│   ├── order.api.routes.js
│   ├── product.api.routes.js
│   └── user.api.routes.js
├── cloudinary.routes.js
├── http
│   ├── order.http.routes.js
│   ├── product.http.routes.js
│   └── user.http.routes.js
├── README.md
└── stripe.routes.js
```

- Routes for cloudinary image upload api are in the `cloudinary.controllers.js` file.
- Routes for stripe api are in the `stripe.controllers.js` file.
