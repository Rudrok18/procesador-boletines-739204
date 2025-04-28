import express, { Request, Response } from 'express';
import { listenToQueue } from './utils/sqs-listener';
import { config } from 'dotenv';

config();
listenToQueue();

const app = express();

const port = process.env.PORT || 3002;

app.get('', (req: Request, res: Response) => {
    res.send('Api works');
});

app.listen(port, () => {
    console.log(`App is running in port ${port}`);
});