
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import Config from './config';



class App {
    app: express.Application;
    port: number | string;
    setup: Function;
    constructor(router: any, port: number, setup: Function = () => { }) {
        this.app = express();
        this.port = port;
        this.app.use(cookieParser());
        this.app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
        this.app.use(express.json()); // Parse JSON data
        this.app.use(cors({
            origin: Config.FRONTEND_URL,
            credentials: true
        }))
        this.app.use('/api', router);
        this.setup = setup;
    }


    public async serve() {
        await this.setup()
        this.app.listen(this.port, () => {
            console.log(` --- server started on port ${this.port} ---`)
        });
    }
}

export default App;