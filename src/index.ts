import express from 'express';
import "dotenv/config";
import cors from "cors";
import morgan from "morgan"

import { connect } from './database/config/config';
import indexRoute from './routes';

const app = express();

app.use(express.json());
app.use(cors())
app.use(morgan("dev"))
app.use("/api", indexRoute)

const port: number = Number(process.env.PORT) || 3000;

const startServer = async () => {
    try {
        await connect();

        app.listen(port, () => {
            console.log(`App listening on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to start the server:", error);
        process.exit(1);
    }
};

startServer();
