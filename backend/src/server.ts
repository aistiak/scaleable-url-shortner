import App from "./app";
// import { connectToDatabase } from "./libs/connectToDatabase";
import AppRouter from "./routers/index.router";



// await connectToDatabase()
// await setupRedis()
// await setUpZookeeper()
// await setUpConfig()
// await setUpManager() 

const app = new App(AppRouter, 3007)

app.serve() 

console.log(`hello`)