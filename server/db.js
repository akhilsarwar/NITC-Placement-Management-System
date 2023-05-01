var mysql = require('mysql');
const fs = require('fs');

const localStorage = {
    host: "mysql_db",
    user: "akhilsarwarth",
    password: "Qwertyuiop[]*123#",
    database: "nitc_pms"
}

const remoteStorage = {
    host: "nitc-pms.mysql.database.azure.com",
    user: "akhilsarwarth",
    password: "Qwertyuiop[]*0123#",
    database: "NITC_PMS",
    port: 3306,
    ssl: { ca: fs.readFileSync("./database/DigiCertGlobalRootCA.crt.pem") }
}

var conn = mysql.createConnection(localStorage);


module.exports = conn;