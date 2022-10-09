const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

var mysql = require('mysql');
const fs = require('fs');


var conn = mysql.createConnection({
  host: "nitc-pms.mysql.database.azure.com",
  user: "akhilsarwarth",
  password: "Qwertyuiop[]*0123#",
  database: "NITC_PMS",
  port: 3306,
  ssl: {ca: fs.readFileSync("./database/DigiCertGlobalRootCA.crt.pem")}
});


conn.connect((err)=>{
    if(err){
        console.log(err);
    }
    else
        console.log('Connected to database')
})


app.listen(3001, ()=>{
    console.log('Server listening on 3001');
})

app.get('/studentDetails/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM Student WHERE uid='${id}'`;
    conn .query(query, (err, result) => {
        console.log(result);
        res.send(result[0]);
    });
});
