import mysql from 'mysql2/promise';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
    host: process.env.AWS_MYSQL_HOST,
    user: process.env.AWS_MYSQL_USER,
    password: process.env.AWS_MYSQL_PASSWORD,
    database: process.env.AWS_MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const saveBoletin = async (content: string, email: string, s3Link: string) => {
    if (!content || !email || !s3Link) {
        throw new Error('Invalid data: content, email, and s3Link are required.');
    }

    const id = uuidv4();
    const query = `
        INSERT INTO boletines (id, content, email, s3Link, leido)
        VALUES (?, ?, ?, ?, ?)
    `;

    await pool.query(query, [id, content, email, s3Link, false]);
    console.log(`Boletin ${id} saved in the database.`);
    return id;
};
