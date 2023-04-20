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



const conn = require('./db')


kill(3001)
    .catch(() => {
        console.log('Kill failed')
    })
    .finally(() => {
        app.listen(3001, () => {
            console.log('Server listening on 3001');
        })
        conn.connect((err) => {
            if (err) {
                console.log(err);
            }
            else
                console.log('Connected to database')
        })
    })



//ROUTES
const userInfo = require('./routes/userInfo')
const recruiter = require('./routes/recruiter')
const student = require('./routes/student')

app.use('/userInfo', userInfo)
app.use('/recruiter', recruiter)
app.use('/student', student)




























