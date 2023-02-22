
## how to use different environemt for development and production in nodejs 

- install dotenv package 
- have a NODE_ENV variable value are prod and dev 
- have multiple env files 
```
.env.dev
.env.prod 

```
- load dynamicaally based to NODE_ENV 
```
const dotenv = require('dotenv')

dotenv.config({path : `env.${process.env.NODE_ENV}`})

const Config = { 
    NODE_ENV : process.end.NODE_ENV 
}
```

- now start node

```
linux/mac 
NODE_ENV=dev node 
process.env.NODE_ENV // dev 

windows [cmd]
set NODE_ENV=dev 
process.env.NODE_ENV // dev 
```
