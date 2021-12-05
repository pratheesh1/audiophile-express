# 1. Services

## All Business Services logic are implemented in this directory.

### 1.1 Directory Structure

```
├── cart.services.js
├── order.services.js
└── README.md
```

- The `cart.services.js` file contains business logic for managing cart. This file is responsible for implementing business strategies while creating, updating, deleting and retrieving cart. This includes, for example:

  - Checking if the product is already in the cart before adding it to the cart.
  - Updating the price of the items in the cart immediately prior to checkout.

- The `order.services.js` file contains business logic for managing order. This file is responsible for implementing business strategies during creating, updating, deleting and retrieving order. This includes, for example:

  - Checking if the product is in stock before placing an order.
  - Updating the overall order status every time the status of the one of the order items is updated.
  - Rolling back the order if the order is unpaid.
