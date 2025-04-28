import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import { saveBoletin } from './db.service';
import { sendEmailNotification } from './sns.service';
import dotenv from 'dotenv';

dotenv.config();

const sqs = new SQSClient({ 
    region: process.env.AWS_REGION, 
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!
    }
});

const queue_url = process.env.AWS_SQS_URL!;

export const listenToQueue = async () => {
    console.log("Listening to SQS queue...");

    while (true) {
        const command = new ReceiveMessageCommand({
            QueueUrl: queue_url,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10,
        });

        const response = await sqs.send(command);

        if (response.Messages) {
            console.log(`Received ${response.Messages.length} message(s)`);
            for (const message of response.Messages) {
                if (!message.Body) continue;

                try {
                    const { content, email, s3Link } = JSON.parse(message.Body);

                    const id = await saveBoletin(content, email, s3Link);
                    await sendEmailNotification(email, s3Link);

                } catch (error) {
                    console.error('Error processing message:', error);
                } finally {
                    if (message.ReceiptHandle) {
                        await sqs.send(new DeleteMessageCommand({ 
                            QueueUrl: queue_url,
                            ReceiptHandle: message.ReceiptHandle
                        }));
                        console.log('Message deleted from queue.');
                    }
                }
            }
        }
    }
};
