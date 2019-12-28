const mysql = require('mysql2/promise')

const connect = async () => {
    return mysql.createConnection({host:'mysql4.mydevil.net', user: 'm1600_printerapi', password: 'uTHeTKIr7VYlgTLuZFwp', database: 'm1600_printer'});
}

export default {
    connect
}