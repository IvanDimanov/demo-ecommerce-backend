# Demo eCommerce BackEnd framework
This project is made as a template for scalable and flexible API endpoints, User role permissions, and data access.

## [Live Demo](https://demo-ecommerce-backend.herokuapp.com/swagger)
## [![App](https://raw.githubusercontent.com/IvanDimanov/demo-ecommerce-backend/master/image.png)](https://demo-ecommerce-backend.herokuapp.com/swagger)

## Tech stack
- fastify: [https://www.fastify.io/](https://www.fastify.io/)
- objection: [https://vincit.github.io/objection.js/](https://vincit.github.io/objection.js/)
- Swagger: [https://github.com/fastify/fastify-swagger](https://github.com/fastify/fastify-swagger)
- TypeScript: [https://www.typescriptlang.org/](https://www.typescriptlang.org/)

## Run locally
App can be run locally using docker and [this repo](https://github.com/IvanDimanov/demo-ecommerce-local-env). <br />
Executing the script below will start the app on your local machine using locally installed DB:
```
git clone git@github.com:IvanDimanov/demo-ecommerce-backend.git
cd ./demo-ecommerce-backend
npm ci
cp .env.example .env
npm start
```

Open [http://localhost:8000/swagger](http://localhost:8000/swagger)

## Database
Database schema can be found [here](https://dbdiagram.io/d/5fa78a6e3a78976d7b7af67f). <br />
DB Migrations are arranged with [this repo](https://github.com/IvanDimanov/demo-ecommerce-db-migrations).
