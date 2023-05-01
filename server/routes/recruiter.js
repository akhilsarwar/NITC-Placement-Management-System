const express = require('express');
const router = express.Router()
const conn = require('../db');

router.use((req, res, next) => {
    console.log('ROUTE [RECRUITER]: ')
    console.log((req.method).toUpperCase() + ': ' + req.url)
    next()
})

router.post('/addRecruiter', (req, res) => {
    const data = req.body;
    conn.query(`INSERT INTO recruiter (name, jobRole, jobDescription, ctc, minCgpaRequired, jobLocation, jobRequirements) values (?, ?, ?, ?, ?, ?, ?)`, [data.name, data.jobRole, data.jobDescription, data.ctc, data.minCgpaRequired, data.jobLocation, data.jobRequirements], (err, result) => {
        if (err) {
            console.log(err);
            res.send({ "sts": "failure" });
        }
        else {
            res.send({ "sts": "success" });
        }
    });
});



router.get('/getRecruiters/:id?', (req, res) => {
    const rid = req.params.id;
    const role = req.query.role;
    const sid = req.query.uid;


    const filterString = req.query.filterString;
    const filterOn = req.query.filterOn ? JSON.parse(req.query.filterOn) : undefined;


    var query = "";
    if (rid === undefined) {
        query = `SELECT * FROM recruiter WHERE `;
        if (role === "Student") {
            query = `SELECT * FROM recruiter R WHERE R.minCgpaRequired <= (SELECT cgpa FROM student S WHERE S.uid = '${sid}') AND `;
        }
        for (var i = 0; i < filterOn.length - 1; i++) {
            query += filterOn[i] + " LIKE '%" + filterString + "%' OR ";
        }
        query += filterOn[filterOn.length - 1] + " LIKE '%" + filterString + "%'";
    }
    else {
        query = `SELECT * FROM recruiter WHERE id='${rid}'`;

    }

    conn.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.send({ "sts": "failure" });
        }
        else {
            const respData = rid === undefined ? result : result[0];
            res.send({ "sts": "success", "data": respData });
        }
    });



})


router.delete('/deleteRecruiter/:id?', (req, res) => {
    const rid = req.params.id;
    conn.query(`DELETE FROM recruiter WHERE id=?`, [rid], (err, result) => {
        if (err) {
            console.log(err);
            res.send({ "sts": "failure" });
        }
        else {
            res.send({ "sts": "success" });
        }
    })
});


router.patch('/changeHiringStatus/:id', (req, res) => {
    const rid = req.params.id;
    // console.log(rid)
    conn.query('SELECT hiringStatus FROM recruiter WHERE id = ?', [rid], (err, result) => {
        if (err) {
            console.log(err);
            res.send({ "sts": "failure" });
        }
        else {
            const now = result[0].hiringStatus === 0 ? 1 : 0;
            conn.query('UPDATE recruiter SET hiringStatus=? WHERE id=?', [now, rid], (err, result) => {
                if (err) {
                    console.log(err);
                    res.send({ "sts": "failure" });
                }
                else {
                    res.send({ "sts": "success" });
                }
            });
        }
    })
})


module.exports = router


