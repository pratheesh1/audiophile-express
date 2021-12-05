# Audiophile

## An eCommerce Platform for audio products.

This project is called `Audiophile` and is a simple eCommerce platform for selling audio products. The project is aimed at individual vendors who want to sell their products online and customers who want to shop for these products specifically. While many general eCommerce platforms exist, there are no major platforms that cater specifically for audio products and is designed with these kinds of products in mind.

This project solves these pain points by providing a simple, yet powerful, eCommerce platform for audio products, which is accessible to both the vendor and the customer, and is designed to be easy to use and maintain.

## Index

<!-- TODO: Add index -->

## 1. Project Design

There are two parts to this project. The product listing and order management is done with server-side rendered routes for which the code can be found in this repository. The front-end eCommerce platform is built with React.js, the source code and details of which can be found [here](https://github.com/pratheesh1/audiophile-react).

An initial thinking process and brainstorming document was created to help the team in the development of the project. The document can be found [here](https://docs.google.com/presentation/d/1WySc4aT7RTCMPersbQStq_BWSSCVUVimFh-vDrcteoU/edit?usp=sharing).

## 2. Deployment

The project is deployed on Heroku. The website can be accessed at the following link:
[https://ps-audiophile.herokuapp.com](https://ps-audiophile.herokuapp.com)

## 3. Website Features and Navigation

The backend website of this project is used to manage the products and orders. All routes of the backend are accessible only to registered users.

### 3.1 Features

Features for the backend website are as follows:

#### 3.1.1 User Account Management

There are two primary types of users in this project. The first is the vendor who is the owner of the products and the second is the customer who is the shopper. An account registered with the font-end cannot be used to access the backend to list products. The user account management is done with the following features:

- Registration
- Login
- Logout
- Email Verification (optional - a verification email is sent to the user's email address, but the user can still access the website without verification)

#### 3.1.2 Product Management

A registered vendor can list products on the website. The products can be added to the cart and can be purchased by the customer. The products can be edited and deleted by the vendor provided that the product is not in the cart or is not purchased by the customer. The product management includes the following features:

- Add product
- Edit product
- Delete product
- Add product image
- Delete product image
- Add custom product attributes
- Delete custom product attributes

The website allows vendors to view all products including those that are listed by other vendors, but only the owner of the product can edit or delete it.

#### 3.1.3 Order Management

A product owner can view the orders placed by the customers and can edit the order status. Once the order is marked as completed, no further changes can be made to the order. The order management includes the following features:

- View order
- Edit order status

#### 3.1.4 Product Search

The product search feature is used to search for products based on the product name, brand, category, price, stock, and attributes.

### 3.2 Navigation

All routes except for the login and registration routes are accessible only to registered users. The navigation is as follows:

#### 3.2.1 Login

User is redirected to home page if already logged in and after login. User can enter the email address and password to login.

#### 3.2.2 Register

User is redirected to home page if already logged in and after registration. User can fill in the details to register.

#### 3.2.3 Home

Home page is the landing page of the website. All products owned by the vendor are displayed on the home page. There is a filter products section on the home page where the user can filter the products based on the criteria described above.

- User is redirected to login page if not logged in.

- From the homepage, user can use `Add New Listing` button or `Add Product` link on Navbar to add a new product.

- Every product is displayed on the home page with the following information:

  - Product id
  - Product name
  - Product cost
  - Product image
  - Product brand
  - Product category
  - Product custom tags
  - Product stock
  - Product Actions
    > - View - User is redirected to product page on frontend
    > - Edit - User is redirected to product edit page
    > - Delete - User is prompted to confirm deletion

#### 3.2.4 Add Product

Add product have 3 pages to add a new product. All mandatory fields are only displayed on the first page. The second page is the product image upload page. The third page is the product attributes page. Images and attributes are not mandatory for a listing.

- User is redirected to login page if not logged in.
- App product form is intuitive and self-explanatory. User can fill in the details to add a new product.

#### 3.2.5 Orders

- User is redirected to login page if not logged in.
- User can view all orders placed by the customers.
- User can edit the order status and details, as well as update the order status.

The following tree shows a general direction in which one might navigate through the website:

```
.
├── Register
├── Login
├── Add Product
├── All Listings
│   ├── Add Product
│   ├── Delete Listing
│   ├── Filter Products
│   ├── Orders
│   ├── Update
│   └── View Listing
├── Your Listings
│   ├── Add Product
│   ├── Delete Listing
│   ├── Filter Products
│   ├── Orders
│   ├── Update
│   └── View Listing
├── Orders
│   ├── View Orders
│   └── Update Order Status
└── Logout

Add new product sub-pages:

├── Add Product
│   └── Add New Product Details
│       └── Add Images
│           └── Add Custom Tags

Update listing sub-pages:

├── Update
│   └── Update Listing
│       └── Update Images
│           └── Update Custom Tags
```

## 4. Technologies Used

The technologies used in this project are as follows:

| Technology                                                                         | Description                                                                                       |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| [Express.js](https://expressjs.com/)                                               | A fast, unopinionated, minimalist web framework for Node.js                                       |
| [Tailwindcss](https://tailwindcss.com/)                                            | A utility-first CSS framework for rapidly build modern websites without ever leaving your HTML.   |
| [morgan](https://github.com/expressjs/morgan)                                      | A logger for Express.js for creating log files for the API.                                       |
| [yup](https://github.com/jquense/yup)                                              | Schema validation library for Node.js. for validating request body, query and parameters headers. |
| [bookshelf](https://bookshelfjs.org/)                                              | ORM for Node.js.                                                                                  |
| [knex](https://knexjs.org/)                                                        | A SQL query builder for Node.js.                                                                  |
| [cloudinary](https://cloudinary.com/)                                              | Cloud image hosting service.                                                                      |
| [connect-flash](https://github.com/jaredhanson/connect-flash)                      | A middleware for Express.js to manage flash messages.                                             |
| [cors](https://github.com/expressjs/cors)                                          | Middleware for Express.js to enable cross-origin resource sharing.                                |
| [csurf](https://github.com/expressjs/csurf)                                        | Middleware for Express.js to enable cross-site request forgery protection.                        |
| [date-fns](https://date-fns.org/)                                                  | A library for date manipulation in Node.js.                                                       |
| [db-migrate](https://db-migrate.readthedocs.io/en/latest/Getting%20Started/usage/) | This project uses db-migrate, a database migration tool for Node.js.                              |
| [db-migrate-mysql](https://github.com/db-migrate/mysql)                            | This project uses db-migrate-mysql, a database migration tool for MySQL.                          |
| [dotenv](https://github.com/motdotla/dotenv)                                       | A library for loading environment variables from a .env file.                                     |
| [express-async-errors](https://github.com/davidbanham/express-async-errors)        | A dead simple ES6 async/await support hack for ExpressJS                                          |
| [express-session](https://github.com/expressjs/session)                            | Middleware for Express.js to manage sessions.                                                     |
| [session-file-store](https://github.com/valery-barysok/session-file-store)         | A session file storage library fpr Express and Connect.                                           |
| [forms](https://github.com/caolan/forms)                                           | Caolan's forms library for Node.js.                                                               |
| [hbs](https://github.com/pillarjs/hbs)                                             | Express.js view engine for handlebars.js                                                          |
| [handlebars-helpers](https://github.com/helpers/handlebars-helpers)                | Handlebars helpers for Node.js.                                                                   |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)                         | An implementation of JSON Web Tokens in Node.js.                                                  |
| [mysql](https://github.com/mysqljs/mysql)                                          | A MySQL driver for Node.js.                                                                       |
| [nodemailer](https://nodemailer.com/)                                              | A Node.js library for sending emails.                                                             |
| [path](https://nodejs.org/docs/latest/api/path.html)                               | Node.js library for working with file and directory paths.                                        |
| [signale](https://github.com/klaussinani/signale)                                  | Logging library for Node.js.                                                                      |
| [stripe](https://stripe.com/)                                                      | A payment processing API for the Internet.                                                        |
| [wax-on](https://github.com/keithws/wax-on)                                        | Wax On adds support to Handlebars for template inheritance with the block and extends helpers.    |
| [font-awesome](https://fontawesome.com/)                                           | A library of icons and fonts.                                                                     |

## 5. Design

### 5.1 UI/UX

The UI/UX design for this project was done with ease of use in mind. The design process for the website are as follows:

#### 5.1.1 User Interface

User interface is designed to be intuitive and easy to use. The user can easily navigate through the website to add new products, view all listings, and view all orders. Most components are self-explanatory and easy to use.

#### 5.2.2 User Experience

Although the website makes prolific use of tables, most components except the tables are mobile-friendly. The website do not expect heavy traffic from mobile devices. All tables om mobile devices are set to scroll to provide a better user experience.

The project uses tailwindcss to create a responsive design. The website is designed to be used on a desktop, laptop, and tablet. Tailwindcss default font family is already a good fit for this website and hence not modified.
The default tailwind font family can be found in the documentation [here](https://tailwindcss.com/docs/font-family).

| Class      | Property                                                                                                                                                                                                                      |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| font-sans  | font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; |
| font-serif | font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;                                                                                                                                                     |
| font-mono  | font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;                                                                                                              |

The color palette for this website is designed to be light and vibrant and provide a fluid user experience. Prominent colours vary between light and dark modes. Major colors used are the following:

```
#25caac, #3f3f46, #22c55e, #d4d4d8, #27272a,  #dbeafe
```

#### 5.2.3 Light/Dark Mode

This project also make use of tailwind classes to create a light/dark mode. The default theme is based on system preferences. User can change the theme by clicking on the light/dark mode button. If the user switches themes, this choice is saved in the local storage and will be used on the next visit.

### 5.2. Database Design

The database design for this project was done with ease of use in mind and also to provide room for expansion. The design is based on the database schema as shown in the schema diagram below.
![Database Schema](https://res.cloudinary.com/dvam3s15z/image/upload/v1638683801/l8lde44nxvcnt4sx4fpu.png)

## 6. Testing

## 7. Acknowledgements

- All the images used in this project are from [unsplash.com](https://unsplash.com/), placeholders are used for the missing images from [placeholder.com](https://placeholder.com/) and brand logs are from [clearbit.com](https://clearbit.com/logo).
- All code snippets and templates used in this project are attributed in the source code where applicable.
