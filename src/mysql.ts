import mysql from 'promise-mysql';

export default {
    async connect () {
        return mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE
        });
    }
}