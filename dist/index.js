"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sqs_listener_1 = require("./utils/sqs-listener");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
(0, sqs_listener_1.listenToQueue)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3002;
app.get('', (req, res) => {
    res.send('Api works');
});
app.listen(port, () => {
    console.log(`App is running in port ${port}`);
});
