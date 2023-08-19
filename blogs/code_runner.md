## Building a simple code runnder with typescript , docker , react and express  

In this project we are going to build a simple browser based code runnder that will be able to run nodejs , golang and python code 

![image](https://github.com/aistiak/scaleable-url-shortner/assets/30620860/70373443-3988-4919-b859-4f43d92e2c69)

we are going to use express for backend and react for frontend 

## preparing  environment to run code 
we are going to use a docker container for both out code running environemnt and for out backend api 
this is what out backend Dockerfile would look like 

```
FROM alpine:latest 

WORKDIR /app 
RUN apk add python3
RUN apk add --no-cache git make musl-dev go curl bash
RUN apk add --no-cache nodejs npm 

COPY ./backend/package*.json ./

# USER node

RUN npm install

COPY --chown=node:node ./backend .

EXPOSE 3000

CMD [ "npm","run", "dev" ]

```

we use apline as our base image and install `python3` , `golang` and `nodejs` latest version with `RUN` command .
And copy the package.json of our backend to image and install dependencies as we are also going to put out backend inside this container 

## backend 
we are going to use express for backend api . There will a route `/run-code` it would expect the language and code text in request body , Joi will be used to validate the request body

```
const RunCodeRequestValidator = Joi.object().keys({
    lang : Joi.string().valid('python','node','golang','typescript').required() ,
    code : Joi.string().allow('') 
})
```
in the router file 
```
   this.router.post(`${this.path}/run-code`,
            JoiValidator(RunCodeRequestValidator),
            this.controller.runCode
   )
```

after receiving the request we are going to create a temporary file to store the code and after running the file and getting the output we are going to remove the file 
So for file related tasks we are going to create a file manager service 

```

import fs from 'fs/promises'
import { v4 as uuid } from 'uuid';

class FileManagerService {

    constructor() {

    }

    public async create(lang, code): Promise<{ success: boolean; path: string }> {
        try {
            const extensionMap = {
                'python': 'py',
                'node': 'js',
                'golang': 'go'
            }
            const path = `./files/${uuid()}.${extensionMap[lang]}`
            await fs.writeFile(path, code)
            return { success: true, path }
        } catch (error) {
            return { success: false, path: null }
        }
    }

    public async remove(path) {

        try {
            await fs.unlink(path)
            return { success: true }
        } catch (error) {
            console.log(error)
            return { success: false }
        }
        
    }
}

export default FileManagerService;

```
`FileManagerService` has two methods `create` and `remove` .
On create method we generate the file names with uuid and give then extension based on the language type and store the files in `/files` directory of the project 
. The method returns an object which has `success` and `path` fileds , if file creation is successfull `success` is true else false .

And on the remove method we simplly remove the file with `fs.unlink()`

We will have a single class for every language which will all implement `RunnerInterface` with a `run` method inside . Every language class will have
to implement its own logic to run code related to it . 


```
interface RunnerInterface {
    run(path) : Promise<string>
}
```

In this way In future when we decide to add more languages to out app we wont need to write code to a single file , every language would have a class associated with it 

For python there will be a `PythonRunnerService` 

```


import { exec } from 'child_process'
import RunnerInterface from '../../interfaces/runner.interface'

class PythonRunnerService implements RunnerInterface {

    public async run(path): Promise<string> {
        try {
            const res1 = await (new Promise((resolve, reject) => {
                exec(`python3 ${path}`, (error, stdout, stderr) => {
                    if (error) {
                        reject(error)
                    }
                    if (stderr) reject(stderr)
                    resolve(stdout)
                })
            }))
            return res1 as string
        } catch (error) {
            console.log(error)
            return error.toString()
        }
    }
}


```

hear we use `exec` method from nodejs buildin module `child_process` to run the code and collect the output .
`run` method takes in `path` as parameter which we get from `FileManagerService.create` method . 
To run the python code we need to pass `python3 python/file/path` to exec and collect the output , we resolve the output if no error and reject with error object if there is any error

similarly for nodejs 

```
class NodeRunnerService implements RunnerInterface{

    public async run(path): Promise<string> {
        try {
            const res1 = await (new Promise((resolve, reject) => {
                exec(`node ${path}`, (error, stdout, stderr) => {
                    if (error) {
                        reject(error)
                    }
                    if (stderr) reject(stderr)
                    resolve(stdout)
                })
            }))
            // console.log({ res1 })
            return res1 as string
        } catch (error) {
            console.log(error)
            return error.toString()
        }
    }
}


```

and for golang 

```

class GoLangRunnerService implements RunnerInterface {
    async run(path: any): Promise<string> {
        try {
            const res1 = await (new Promise((resolve, reject) => {
                exec(`go run ${path}`, (error, stdout, stderr) => {
                    if (error) {
                        reject(error)
                    }
                    if (stderr) reject(stderr)
                    resolve(stdout)
                })
            }))
            // console.log({ res1 })
            return res1 as string
        } catch (error) {
            console.log(error)
            return error.toString()
        }
    }

}



```

and we map these language related services from a Manager which is used in the controller 

```
class Manager {


    public static async getOutput(lang, code): Promise<string> {

        const fileManagerService = new FileManagerService()
        const { success, path } = await fileManagerService.create(lang, code);
        if(!success) return 'error'
        const mp = {
            'python': PythonRunnerService,
            'node' : NodeRunnerService ,
            'golang' : GoLangRunnerService 
        }
        const runner: RunnerInterface = new mp[lang]
        const out = await runner.run(path)
        await fileManagerService.remove(path)
        return out
    }
}

```

we now just need to get the lanugage with a dropdown and code from a textarea and pass them down to the api when calling and show the response in another textarea
and we have outselves a code runnder 

## docker compose 
To bring the whole thing up with a single command we can use docker-compose 

we whould aslo have a dockerfile for our frontend project 

```
FROM node:latest

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

# RUN yarn install

COPY --chown=node:node . .

EXPOSE 3001

CMD [ "yarn", "dev" ]
```
so the project structure would look like this 
<img width="399" alt="image" src="https://github.com/aistiak/scaleable-url-shortner/assets/30620860/8381d868-2c2a-492b-a9fd-b1691764d821">
now to combile the backend and frontend we write a docker-compose file

```
services:
  server:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - 3000:3000
    volumes:
      - ./backend:/app
  client:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports: 
      - 3001:3001
    volumes:
      - ./frontend:/home/node/app
      - ./frontend/node_modules:/home/node/app/node_modules  
```

hear we have two services server and client . Bindmount was used hear to mount code from local drive to the container which is of greate help for development as we could run 
both backend and frontend with single command and see code changes made to our local drive relect inside the container .

If we run docker compose up we can access the client / fronetend at localhost:3001 in our browse .

hear is the github repository link of the project 

https://github.com/aistiak/code-runner