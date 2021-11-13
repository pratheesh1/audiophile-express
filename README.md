# Express API Template -Node.js/Express/Tailwind

Express API Template with Node.js, Express, Tailwind and hbs as the template engine.

## Packages:

<!-- TODO: add prod package names -->
<!-- TODO: add dev package names -->

## CSS

This template is configured for tailwindcss and jit mode is enabled out of the box. No need to worry about file sizes during development.

> jit only watches files in views folder (update tailwind.config.js to change this).

> I assume you have nodemon installed globally. If not run `npm i -g nodemon` to install nodemon globally (edit scripts if you prefer not using nodemon).

Run `npm install` to install all dependencies.

Run `npm run dev` to start the development server.

Run `npm run build:css` at least once before deploying to production (start script is not configured to build css).

Run `npm start` to start the production server.

## Current Setup

<!-- prettier ignore -->

```
<!-- TODO: add tree here -->

```

### Current Setup - Detailed

<!-- prettier ignore -->

```
// default route
<!-- TODO: add default route here -->

//static folder
app.use(express.static(path.join(__dirname, "/public")));

//wax-on set-up
wax.on(hbs.handlebars);
<!-- TODO: add layout and partials path -->

```
