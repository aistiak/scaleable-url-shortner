import App from "./app";
import config from "./config";
import { setupRedis } from "./connections/redis";
import { connectToDatabase } from "./libs/connectToDatabase";
import { setUpManager } from "./libs/initManager";
import { setUpZookeeper } from "./libs/setUpZookeeper";
// import { connectToDatabase } from "./libs/connectToDatabase";
import AppRouter from "./routers/index.router";


const setup = async () => {
    await connectToDatabase()
    await setupRedis()
    await setUpZookeeper()
    await setUpManager()
}

// @ts-ignore
const app = new App(AppRouter, config.EXPRESS_PORT,setup)

app.serve()

console.log(`hello`)