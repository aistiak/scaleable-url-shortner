import App from "./app";
// import { connectToDatabase } from "./libs/connectToDatabase";
import AppRouter from "./routers/index.router";




const app = new App(AppRouter, 3007)

app.serve() 

console.log(`hello`)