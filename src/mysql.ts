import mysql from 'promise-mysql';

export default {
    async connect () {
        return mysql.createConnection({
            host:'mysql4.mydevil.net',
            user: 'm1600_printerapi',
            password: 'uTHeTKIr7VYlgTLuZFwp',
            database: 'm1600_printer'
        });
    }
}