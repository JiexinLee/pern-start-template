# PERN Start Template

This template is a starter of PERN stack, the tech stacks
includes:

- Typescript
- NodeJS
- Express
- ReactJS
- PostgreSQL
- Prisma
- TailwindCSS
- ✨ Magic ✨

## Features

- Easy to use, just connect your Postgre DB by add .env file
- Half built backend with signin and signup endpoints
- Login and Signup page

## Installation

This template requires [Node.js](https://nodejs.org/) v18+
to run.

Install the dependencies and devDependencies and start the
server.

```sh
cd pern-start-template
npm i
npm run dev
```

Setting up the databse

```sh
DATABASE_URL="postgresql://xxx" #your database url
ENVIRONMENT=development #your environment
ACCESS_TOKEN_SECRET=<random_key>
REFRESH_TOKEN_SECRET=<random_key>
```

## Development

After starting the server the client will be running on

```sh
http://localhost:5173
```

Server will be running on

```sh
http://localhost:8765
```

(optional) If cannot connect to the server, try:

```sh
http://127.0.0.1:8765
```

## License

**Free Software, Hell Yeah!**
