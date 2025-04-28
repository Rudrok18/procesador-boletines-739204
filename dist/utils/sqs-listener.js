"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listenToQueue = void 0;
const client_sqs_1 = require("@aws-sdk/client-sqs");
const db_service_1 = require("./db.service");
const sns_service_1 = require("./sns.service");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sqs = new client_sqs_1.SQSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN
    }
});
const queue_url = process.env.AWS_SQS_URL;
const listenToQueue = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Listening to SQS queue...");
    while (true) {
        const command = new client_sqs_1.ReceiveMessageCommand({
            QueueUrl: queue_url,
            MaxNumberOfMessages: 1,
            WaitTimeSeconds: 10,
        });
        const response = yield sqs.send(command);
        if (response.Messages) {
            console.log(`Received ${response.Messages.length} message(s)`);
            for (const message of response.Messages) {
                if (!message.Body)
                    continue;
                try {
                    const { content, email, s3Link } = JSON.parse(message.Body);
                    const id = yield (0, db_service_1.saveBoletin)(content, email, s3Link);
                    yield (0, sns_service_1.sendEmailNotification)(email, s3Link);
                }
                catch (error) {
                    console.error('Error processing message:', error);
                }
                finally {
                    if (message.ReceiptHandle) {
                        yield sqs.send(new client_sqs_1.DeleteMessageCommand({
                            QueueUrl: queue_url,
                            ReceiptHandle: message.ReceiptHandle
                        }));
                        console.log('Message deleted from queue.');
                    }
                }
            }
        }
    }
});
exports.listenToQueue = listenToQueue;
