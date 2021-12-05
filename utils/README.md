# 1. Utility Functions

## This folder contains utility functions that are used throughout the project.

### 1.1 Documentation

- [nodemailer](https://nodemailer.com/about/)

### 1.2 Directory Structure

```
├── index.js
├── nodemailer.config.js
└── README.md
```

- `index.js`

  This file contains the main functions that are used in the application. These contain the following functions:

  - `getHashedPassword` - This function is used to hash a password.
  - `generateToken` - This function is used to generate a jwt token.
  - `verifyToken` - This function is used to verify a jwt token.
  - `formatDate` - A handlebar helper function that formats a date.
  - `comparison` - A handlebar helper function that compares two values.

- `nodemailer.config.js`

  This file contains the configuration for the nodemailer package. This is currently only user for verifying the email address for new users, but the verification is not mandatory to use the application.
