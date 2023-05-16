## Building a simple code runnder with docker , react and express 

In this project we are going to build a simple browser based code runnder that will be able to run nodejs , golang and python code 

![](https://hackmd.io/_uploads/HkBuuUer2.png)

we are going to use express for backend and react for frontend 
## backend 
we are going to use express for backend api . There will a route `/run-code` it would exprec the language and code text in request body , Joi will be used to validate the request body

```
const RunCodeRequestValidator = Joi.object().keys({
    lang : Joi.string().valid('python','node','golang','typescript').required() ,
    code : Joi.string().allow('') 
})
```


## frontend

## docker 
> describe how to write a docker file to run the whole project at once  