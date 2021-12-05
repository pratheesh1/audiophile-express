# 1. Data Access and Management

## Data access and management for the application.

This project uses a data access and management layer for all database operations. Custom API(s) of this project do not directly access the database, whether using SQL or using any of the api provided by bookshelf/knex ORM. All database operations are exclusively through the data access layer.

### 1.1 Data Access Layer (Repositories)

All CRUD operations required for the application are implemented in the repository files.

### 1.2 Directory Structure

```
├── address.repositories.js
├── cart.repositories.js
├── order.repositories.js
├── product.repositories.js
├── README.md
└── user.repositories.js
```
