import express from 'express';
import dotenv from 'dotenv'
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";


import { connect } from './database/config/config';
import indexRoute from './routes';

import { sendLoginNotification } from '../service/emailService';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors())
app.use(morgan("dev"))
app.use("/api", indexRoute)



app.post('/publish-article', async (req, res) => {
    const { articleTitle, clientEmails } = req.body;

    const articleLink = `https://kickside.rw/articles/${articleTitle.replace(/\s+/g, '-').toLowerCase()}`;

    // Send notification emails to clients
    try {
        await Promise.all(clientEmails.map(email => sendLoginNotification (email, articleTitle, articleLink)));
        res.status(200).send('Notification emails sent successfully!');
    } catch (error) {
        res.status(500).send('Error sending notification emails');
    }
});



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
