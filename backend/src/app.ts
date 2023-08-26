
import express from 'express';



class App {
    app: express.Application;
    port: number | string;
    setup : Function ;
    constructor(router: any, port: number,setup : Function = () => {}) {
        this.app = express();
        this.port = port;
        this.app.use('/', router) ;
        this.setup = setup ;
    }


    public async serve() {
        await this.setup()
        this.app.listen(this.port, () => {
            console.log(` --- server started on port ${this.port} ---`)
        });
    }
}

export default App;