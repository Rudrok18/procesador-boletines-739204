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
exports.saveBoletin = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const uuid_1 = require("uuid");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = promise_1.default.createPool({
    host: process.env.AWS_MYSQL_HOST,
    user: process.env.AWS_MYSQL_USER,
    password: process.env.AWS_MYSQL_PASSWORD,
    database: process.env.AWS_MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
const saveBoletin = (content, email, s3Link) => __awaiter(void 0, void 0, void 0, function* () {
    if (!content || !email || !s3Link) {
        throw new Error('Invalid data: content, email, and s3Link are required.');
    }
    const id = (0, uuid_1.v4)();
    const query = `
        INSERT INTO boletines (id, content, email, s3Link, leido)
        VALUES (?, ?, ?, ?, ?)
    `;
    yield pool.query(query, [id, content, email, s3Link, false]);
    console.log(`Boletin ${id} saved in the database.`);
    return id;
});
exports.saveBoletin = saveBoletin;
