
import express from 'express';


class App {
    app: express.Application;
    port: number;
    constructor(router: any, port: number) {
        this.app = express();
        this.port = port;
        this.app.use('/', router)
    }


    public async serve() {
        this.app.listen(this.port, () => {
            console.log(` --- server started on port ${this.port} ---`)
        })
    }
}

export default App ;