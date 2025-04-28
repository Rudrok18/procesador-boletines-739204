import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import dotenv from 'dotenv';

dotenv.config();

const sns = new SNSClient({ 
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY!,
        secretAccessKey: process.env.AWS_SECRET_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN!,
    }
});

const sns_topic_arn = process.env.AWS_SNS_ARN!;

export const sendEmailNotification = async (email: string, link: string) => {

    const params = {
        TopicArn: sns_topic_arn,
        Message: `New boletin generated. You can see it at: ${link}`,
        Subject: "New boletin available",
    };

    const command = new PublishCommand(params);
    await sns.send(command);

    console.log('Email sent through SNS.');
}