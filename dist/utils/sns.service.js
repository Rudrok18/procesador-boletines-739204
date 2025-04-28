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
exports.sendEmailNotification = void 0;
const client_sns_1 = require("@aws-sdk/client-sns");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sns = new client_sns_1.SNSClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        sessionToken: process.env.AWS_SESSION_TOKEN,
    }
});
const sns_topic_arn = process.env.AWS_SNS_ARN;
const sendEmailNotification = (email, link) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        TopicArn: sns_topic_arn,
        Message: `New boletin generated. You can see it at: ${link}`,
        Subject: "New boletin available",
    };
    const command = new client_sns_1.PublishCommand(params);
    yield sns.send(command);
    console.log('Email sent through SNS.');
});
exports.sendEmailNotification = sendEmailNotification;
