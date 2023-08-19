
## how to use different environemt variable for development and production in nodejs  

Some information in our project is secret (like API keys, secrets, etc.), so we cannot use them directly, so we store them in a .env file and push the code to .gitignore the file thus keeping our sensitive information safe.
And we might have separate sets of environment variables for development and production. For example, when working with payment gateways, we might have a sandbox or development token for development and another for use in production.


One way to deal with this is to keep separate .env files for development and production environment and load them dynamically.


We will require the `dotenv` package for loading .env files
```
yarn add dotenv
```
Let's say we have `.env.dev` and `.env.prod` two different files.


```
const dotenv = require('dotenv')


dotenv.config({path : `env.${process.env.NODE_ENV}`})


const Config = {
NODE_ENV : process.end.NODE_ENV
}
```


and update the script section in package.json and add `NODE_ENV` environment manually.
```
"scripts" : {
"dev" : "NODE_ENV=dev npx nodemon",
"start" : "NODE_ENV=prod node dist/index.js"
}
```


Your scripts section may look different based on your project,  you just have to prefix the command with `NODE_ENV=dev` and `NODE_ENV=prod`

