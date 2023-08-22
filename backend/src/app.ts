
import express from 'express';
import { connectToDatabase } from './libs/connectToDatabase';
import { setUpManager } from './libs/initManager';
import { setUpZookeeper } from './libs/setUpZookeeper';
import { setupRedis } from './connections/redis';


class App {
    app: express.Application;
    port: number;
    constructor(router: any, port: number) {
        this.app = express();
        this.port = port;
        this.app.use('/', router)
    }


    public async serve() {
        await connectToDatabase()
        await setupRedis()
        await setUpZookeeper()
        // await setUpConfig()
        await setUpManager()
        this.app.listen(this.port, () => {
            console.log(` --- server started on port ${this.port} ---`)
        })
    }
}

export default App;