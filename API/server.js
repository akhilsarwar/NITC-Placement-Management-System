//TODO: sending custom http error messages for error cases for each request
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileupload = require("express-fileupload");
const kill = require('kill-port')

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
app.use(fileupload());

var mysql = require('mysql');
const fs = require('fs');
const killPort = require('kill-port');


var conn = mysql.createConnection({
  host: "nitc-pms.mysql.database.azure.com",
  user: "akhilsarwarth",
  password: "Qwertyuiop[]*0123#",
  database: "NITC_PMS",
  port: 3306,
  ssl: {ca: fs.readFileSync("./database/DigiCertGlobalRootCA.crt.pem")}
});




kill(3001)
.catch(() => {
    console.log('Kill failed')
})
.finally(()=> {
    app.listen(3001, ()=>{
        console.log('Server listening on 3001');
    })
    conn.connect((err)=>{
        if(err){
            console.log(err);
        }
        else
            console.log('Connected to database')
    })
})


app.get('/studentDetails/:id', (req, res) => {
    const id = req.params.id;
    const query = `SELECT * FROM Student WHERE uid='${id}'`;
    conn .query(query, (err, result) => {
        console.log(result);
        res.send(result[0]);
    });
});


app.get('/userInfo/:id', (req, res) => {
    const id = req.params.id;
    console.log(req.query);
    const role = req.query.role;
    let query = "";
    if(role === "Student"){
        query = `SELECT * FROM Student WHERE uid='${id}'`;
    }
    else{
        query = `SELECT * FROM PC WHERE uid = '${id}'`;
    }
    conn .query(query, (err, result) => {
        if(err){
            console.log(err);
            res.send({sts: "failure"});
        }
        else{
            res.send({sts: "success", data: result[0]});
        }
        
    });
});


//response body is a json object {sts: failure} or {sts: success}
app.post('/updateUserProfile/:id', (req, res)=> {
    const data = req.body;
    const id = req.params.id; 
    const role = data.role;
    console.log(data)
    console.log(req.files)


    if(role === "Student"){

        conn.beginTransaction(function (err) {
            if(err) {
                console.log(err);
                res.send({"sts" : "failure"});
            }

            conn.query(`SELECT uid FROM Student WHERE uid=?`, [id], (err, result) => {
                if(err){
                    console.log(err);
                    res.send({"sts" : "failure"});
                    return conn.rollback(function () {
                        console.log('Rolling Back the transaction');
                    })
                }
                if(result.length > 0){
                    
                    //update the profile
                    conn.query(`UPDATE Student SET name=?, rollNo=?, email=?, cgpa=?, address=?, contact=?, stream=?, branch=?, dob=?, placedAt=? WHERE uid=?`, [data.name, data.rollNo, data.email, data.cgpa, data.address, data.contact, data.stream, data.branch, data.dob, data.placedAt, id], (err, result) =>{
                        if(err){
            
                            console.log(err);
                            res.send({"sts" : "failure"});
                            return conn.rollback(function () {
                                console.log('Rolling Back the transaction');
                            })

                        }
                        else{
                            const resumeFile = req.files.resume;
                            if(resumeFile !== null){
                                conn.query(`DELETE FROM Resume WHERE sid=?`, [id], (err, result) => {
                                    if(err){
                                        console.log(err);
                                        res.send({"sts" : "failure"});
                                        return conn.rollback(function () {
                                            console.log('Rolling Back the transaction');
                                        })
                                    }
                                    else{
                                        console.log('Delete Resume Successful')
                                        conn.query(`INSERT INTO Resume (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, resumeFile.name, resumeFile.data, resumeFile.size, resumeFile.encoding, resumeFile.mimetype], (err, result) => {
                                            if(err){
                                                console.log(err);
                                                res.send({"sts": "failure"});
                                                return conn.rollback(function () {
                                                    console.log('Rolling Back the transaction');
                                                })
                                            }
                                            console.log('Insert Resume Successful')
                                            const profileImage = req.files.profileImage;
                                            if(profileImage !== null){
                                                conn.query(`DELETE FROM ProfileImage WHERE sid=?`, [id], (err, result) => {
                                                    if(err){
                                                        console.log(err);
                                                        res.send({"sts": "failure"});
                                                        return conn.rollback(function () {
                                                            console.log('Rolling Back the transaction');
                                                        })      
                                                    }
                                                    console.log('Delete Profile Image Successful')
                                                    conn.query(`INSERT INTO ProfileImage (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, profileImage.name, profileImage.data, profileImage.size, profileImage.encoding, profileImage.mimetype], (err, result) => {
                                                        if(err) {
                                                            console.log(err);
                                                            res.send({"sts": "failure"});
                                                            return conn.rollback(function () {
                                                                console.log('Rolling Back the transaction');
                                                            })  
                                                        }
                                                        
                                                        console.log('Insert Profile Image Successful')
                                                        conn.commit(function(err) {
                                                            if (err) {
                                                                console.log(err);
                                                                res.send({"sts": "failure"});
                                                                return conn.rollback(function () {
                                                                    console.log('Rolling Back the transaction');
                                                                })      
                                                            }
                                                            console.log('Profile Updation [Change existing] Success');
                                                            res.send({"sts" : "success"});                        
                                                        });
                                                    
                                                    })
                                                })
                                            }

                                            else{
                                                conn.commit(function(err) {
                                                    if (err) {
                                                        console.log(err);
                                                        res.send({"sts": "failure"});
                                                        return conn.rollback(function () {
                                                            console.log('Rolling Back the transaction');
                                                        })      
                                                    }
                                                    console.log('Profile Updation [Change existing] Success');
                                                    res.send({"sts" : "success"});                        
                                                });
                                            }
                                            
                                        })
                                    }
                                })
                                
                            }
                            else{
                                conn.commit(function(err) {
                                    if (err) {
                                        console.log(err);
                                        res.send({"sts": "failure"});
                                        return conn.rollback(function () {
                                            console.log('Rolling Back the transaction');
                                        })      
                                    }
                                    console.log('Profile Updation [Change existing] Success');
                                    res.send({"sts" : "success"});                        
                                });
                            }
                        }
                    })
                }
                else{
                    //insert a new profile
                    conn.query(`INSERT INTO Student (uid, name, rollNo, email, cgpa, address, contact, stream, branch, dob, placedAt) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`, [id, data.name, data.rollNo, data.email, data.cgpa, data.address, data.contact, data.stream, data.branch, data.dob, data.placedAt], (err, result)=>{
                        if(err) {
                            console.log(err);
                            res.send({"sts": "failure"});
                            return conn.rollback(function () {
                                console.log('Rolling Back the transaction');
                            })  
                        }
                        else{
                            console.log('Details Updation Successful')

                            //add resume to the resume table
                            const resumeFile = req.files.resume;

                            conn.query(`INSERT INTO Resume (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, resumeFile.name, resumeFile.data, resumeFile.size, resumeFile.encoding, resumeFile.mimetype], (err, result) => {
                                if(err) {
                                    console.log(err);
                                    res.send({"sts": "failure"});
                                    return conn.rollback(function () {
                                        console.log('Rolling Back the transaction');
                                    })  
                                }
                                
                                console.log('Insert Resume Successful')
                                const profileImage = req.files.profileImage;
                                conn.query(`INSERT INTO ProfileImage (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, profileImage.name, profileImage.data, profileImage.size, profileImage.encoding, profileImage.mimetype], (err, result) => {
                                    if(err) {
                                        console.log(err);
                                        res.send({"sts": "failure"});
                                        return conn.rollback(function () {
                                            console.log('Rolling Back the transaction');
                                        })  
                                    }

                                    console.log('Insert Profile Image Successful')
                                    conn.commit(function(err) {
                                        if (err) {
                                            console.log(err);
                                            res.send({"sts": "failure"});
                                            return conn.rollback(function () {
                                                console.log('Rolling Back the transaction');
                                            })      
                                        }
                                        console.log('Profile Updation [Change existing] Success');
                                        res.send({"sts" : "success"});                        
                                    });
                                })
                            })
                        }
                    });
                }
                
            });        
        })

        
    }
    else if(role === "Placement Coordinator"){
        console.log('here')
        conn.beginTransaction(function (err) {
            if(err) {
                console.log(err);
                res.send({"sts" : "failure"});
            }

            conn.query(`SELECT uid FROM PC WHERE uid=?`, [id], (err, result) => {
                if(err){
                    console.log(err);
                    res.send({"sts" : "failure"});
                    return conn.rollback(function () {
                        console.log('Rolling Back the transaction');
                    })  
                }
                if(result.length > 0){
                    //update the profile
                    conn.query(`UPDATE PC SET name=?, email=?, address=?, contact=?, dob=?, department=?, post=? WHERE uid=?`, [data.name, data.email, data.address, data.contact, data.dob, data.department, data.post, id], (err, result) =>{
                        if(err){
                            console.log(err);
                            res.send({"sts" : "failure"});
                            return conn.rollback(function () {
                                console.log('Rolling Back the transaction');
                            })  
                        }

                        console.log('Details Updation Successful')
                        const profileImage = req.files.profileImage;
                        if(profileImage !== null){
                            conn.query(`DELETE FROM ProfileImage WHERE sid=?`, [id], (err, result) => {
                                if(err){
                                    console.log(err);
                                    res.send({"sts": "failure"});
                                    return conn.rollback(function () {
                                        console.log('Rolling Back the transaction');
                                    })      
                                }

                                console.log('Delete Profile Image Successful')
                                conn.query(`INSERT INTO ProfileImage (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, profileImage.name, profileImage.data, profileImage.size, profileImage.encoding, profileImage.mimetype], (err, result) => {
                                    if(err) {
                                        console.log(err);
                                        res.send({"sts": "failure"});
                                        return conn.rollback(function () {
                                            console.log('Rolling Back the transaction');
                                        })  
                                    }
                                    
                                    console.log('Insert Profile Image Successful')
                                    conn.commit(function(err) {
                                        if (err) {
                                            console.log(err);
                                            res.send({"sts": "failure"});
                                            return conn.rollback(function () {
                                                console.log('Rolling Back the transaction');
                                            })      
                                        }
                                        console.log('Profile Updation [Change existing] Success');
                                        res.send({"sts" : "success"});                        
                                    });                 
                                })
                            })
                        }

                        else{
                            conn.commit(function(err) {
                                if (err) {
                                    console.log(err);
                                    res.send({"sts": "failure"});
                                    return conn.rollback(function () {
                                        console.log('Rolling Back the transaction');
                                    })      
                                }
                                console.log('Profile Updation [Change existing] Success');
                                res.send({"sts" : "success"});                        
                            });
                        }
                        
                        
                    })
                }
                else{
                    //insert a new profile
                    conn.query(`INSERT INTO PC (uid, name, email, address, contact, dob, department, post) values (?, ?, ?, ?, ?, ?, ?, ?)`, [id, data.name, data.email, data.address, data.contact, data.dob, data.department, data.post], (err, result)=>{
                        if(err){
                            console.log(err);
                            res.send({"sts" : "failure"});
                            return conn.rollback(function () {
                                console.log('Rolling Back the transaction');
                            })  
                        }
                        
                        console.log('Details Updation Successful')
                        const profileImage = req.files.profileImage;
                        conn.query(`INSERT INTO ProfileImage (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, profileImage.name, profileImage.data, profileImage.size, profileImage.encoding, profileImage.mimetype], (err, result) => {
                            if(err) {
                                console.log(err);
                                res.send({"sts": "failure"});
                                return conn.rollback(function () {
                                    console.log('Rolling Back the transaction');
                                })  
                            }

                            console.log('Insert Profile Image Successful')
                            conn.commit(function(err) {
                                if (err) {
                                    console.log(err);
                                    res.send({"sts": "failure"});
                                    return conn.rollback(function () {
                                        console.log('Rolling Back the transaction');
                                    })      
                                }
                                console.log('Profile Updation [Change existing] Success');
                                res.send({"sts" : "success"});                        
                            });
                        })
                    });
                }
                
            });

        })
        
    }
    

});


app.post('/addRecruiter', (req, res) => {
    const data = req.body;
    conn.query(`INSERT INTO Recruiter (name, jobRole, jobDescription, ctc, minCgpaRequired, jobLocation, jobRequirements) values (?, ?, ?, ?, ?, ?, ?)`, [data.name, data.jobRole, data.jobDescription, data.ctc, data.minCgpaRequired, data.jobLocation, data.jobRequirements], (err, result)=>{
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{
            res.send({"sts": "success"});
        }
    });
});



app.get('/getRecruiters/:id?', (req, res) => {
    const rid = req.params.id;
    const role = req.query.role;
    const sid = req.query.uid;


    const filterString = req.query.filterString;
    const filterOn = req.query.filterOn ? JSON.parse(req.query.filterOn): undefined;


    var query = "";
    if(rid === undefined){
        query = `SELECT * FROM Recruiter WHERE `;
        if(role === "Student"){
            query = `SELECT * FROM Recruiter R WHERE R.minCgpaRequired <= (SELECT cgpa FROM Student S WHERE S.uid = '${sid}') AND `;
        }
        for(var i = 0; i < filterOn.length - 1; i++){
            query += filterOn[i] + " LIKE '%" + filterString + "%' OR "; 
        }
        query += filterOn[filterOn.length - 1] + " LIKE '%" + filterString + "%'";
    }
    else{
        query = `SELECT * FROM Recruiter WHERE id='${rid}'`;
        
    }

    conn.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{
            const respData = rid === undefined ? result: result[0];
            res.send({"sts": "success", "data": respData});
        }
    });



})


app.delete('/deleteRecruiter/:id?', (req, res)=>{
    const rid = req.params.id;
    conn.query(`DELETE FROM Recruiter WHERE id=?`, [rid], (err, result)=>{
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{
            res.send({"sts": "success"});
        }
    })
});



app.get('/getStudents/:id?', (req, res) => {
    const sid = req.params.id;
    const filterString = req.query.filterString;
    const filterOn = req.query.filterOn ? JSON.parse(req.query.filterOn): undefined;

    var query = "";
    if(sid === undefined){
        query = `SELECT * FROM Student WHERE `;
        for(var i = 0; i < filterOn.length - 1; i++){
            query += filterOn[i] + " LIKE '%" + filterString + "%' OR "; 
        }
        query += filterOn[filterOn.length - 1] + " LIKE '%" + filterString + "%'";
    }
    else{
        query = `SELECT * FROM Student WHERE uid='${sid}'`;
        
    }
    conn.query(query, (err, result) => {
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{
            const respData = sid === undefined ? result: result[0];
            res.send({"sts": "success", "data": respData});
        }
    })
})



app.get('/getAppliedStatus', (req, res) => {
    const sid = req.query.sid;
    const rid = req.query.rid;

    conn.query('SELECT * FROM Applied WHERE sid=? AND rid=?', [sid, rid], (err, result) => {
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{
            if(result.length > 0){
                res.send({"sts": "success", "data": true});
            }
            else{
                res.send({"sts": "success", "data": false});
            }
        }
    })
})



app.post('/apply', (req, res) => {
    const sid = req.body.sid;
    const rid = req.body.rid;
    const appliedTime = req.body.appliedTime;
    conn.query('INSERT INTO Applied (sid, rid, appliedTime) values (?, ?, ?)', [sid, rid, appliedTime], (err, result)=> {
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{
            res.send({"sts": "success"});
        }
    })

})


app.get('/getApplied', (req, res) => {
    const sid = req.query.sid;
    const query = "SELECT * FROM Recruiter R WHERE R.id IN (SELECT A.rid FROM Applied A WHERE A.sid = ?)";
    conn.query(query, [sid], (err, result) => {
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{
            res.send({"sts": "success", "data" : result});
        }
    });
})


app.patch('/updatePlacedAt/:id', (req, res) =>{
    const placedAt = req.body.placedAt;
    const id = req.params.id;
    conn.query('UPDATE Student SET placedAt = ? WHERE uid = ?', [placedAt, id], (err, result) => {
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{
            res.send({"sts": "success"});
        }
    })
})


app.get('/getPlacementStatus/:id', (req, res) => {
    const id = req.params.id;
    conn.query('SELECT placedAt from Student WHERE uid = ?', [id], (err, result) => {
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{
            var sts = result[0].placedAt === null ? false: true
            res.send({"sts": "success", data: sts});
        }
    })
})



app.patch('/changeHiringStatus/:id', (req, res) => {
    const rid = req.params.id;
    // console.log(rid)
    conn.query('SELECT hiringStatus FROM Recruiter WHERE id = ?', [rid], (err, result) => {
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{
            const now = result[0].hiringStatus === 0 ? 1: 0;
            conn.query('UPDATE Recruiter SET hiringStatus=? WHERE id=?', [now, rid], (err, result)=>{
                if(err){
                    console.log(err);
                    res.send({"sts": "failure"});
                }
                else{
                    res.send({"sts": "success"});
                }       
            });
        }
    })
})


app.get('/getResume/:id', (req, res) => {
    const sid = req.params.id;
    conn.query('SELECT * FROM Resume WHERE sid = ?', [sid], (err, result) => {
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{   
            // console.log(result[0])
            if(result.length > 0){
                var buff = new Buffer.from(result[0].data)
                res.send({"sts": "success", "data": buff});
            }
            else{
                res.send({"sts" : "success", "data" : null});
            }
        }
    })
})



app.get('/getProfileImage/:id', (req, res) => {
    const sid = req.params.id;
    conn.query('SELECT * FROM ProfileImage WHERE sid = ?', [sid], (err, result) => {
        if(err){
            console.log(err);
            res.send({"sts": "failure"});
        }
        else{   
            // console.log(result[0])
            if(result.length > 0){
                var buff = new Buffer.from(result[0].data)
                res.send({"sts": "success", "data": buff});
            }
            else{
                res.send({"sts" : "success", "data" : null});
            }
        }
    })
})

