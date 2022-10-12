//TODO: sending custom http error messages for error cases for each request


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());

var mysql = require('mysql');
const fs = require('fs');
const { resolveSoa } = require('dns');


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



//response body is a json object {sts: failure} or {sts: success}
app.post('/updateUserProfile/:id', (req, res)=> {
    const data = req.body;
    const id = req.params.id; 
    conn.query(`SELECT uid FROM Student WHERE uid=?`, [id], (err, result) => {
        if(err){
            console.log(err);
            res.send({"sts" : "failure"});
        }
        if(result.length > 0){
            //update the profile
            conn.query(`UPDATE Student SET name=?, rollNo=?, email=?, cgpa=?, address=?, contact=?, stream=?, branch=?, dob=?, placedAt=? WHERE uid=?`, [data.name, data.rollNo, data.email, data.cgpa, data.address, data.contact, data.stream, data.branch, data.dob, data.placedAt, id], (err, result) =>{
                if(err){
                    console.log('Profile Updation [Change existing] Failure');
                    console.log(err);
                    res.send({"sts" : "failure"});
                }
                else{
                    console.log('Profile Updation [Change existing] Success');
                    res.send({"sts" : "success"});
                }
            })
        }
        else{
            //insert a new profile
            conn.query(`INSERT INTO Student (uid, name, rollNo, email, cgpa, address, contact, stream, branch, dob, placedAt) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`, [id, data.name, data.rollNo, data.email, data.cgpa, data.address, data.contact, data.stream, data.branch, data.dob, data.placedAt], (err, result)=>{
                if(err){
                    console.log('Profile Updation [Insertion] Failed');
                    console.log(err);
                    res.send({"sts" : "failure"});
                }
                else{
                    console.log('Profile Updation [Insertion] Success')
                    res.send({"sts" : "success"});
                }
            });
        }
        
    });
    
});
