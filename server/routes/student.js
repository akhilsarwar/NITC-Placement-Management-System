const express = require('express');
const router = express.Router()
const conn = require('../db');

router.use((req, res, next) => {
    console.log('ROUTE [STUDENT]: ')
    console.log((req.method).toUpperCase() + ': ' + req.url)
    next()
})

//get Student/s information
router.get('/get/:id?', (req, res) => {
    const sid = req.params.id;
    const filterString = req.query.filterString;
    const filterOn = req.query.filterOn ? JSON.parse(req.query.filterOn) : undefined;

    var query = "";
    if (sid === undefined) {
        query = `SELECT * FROM student WHERE `;
        for (var i = 0; i < filterOn.length - 1; i++) {
            query += filterOn[i] + " LIKE '%" + filterString + "%' OR ";
        }
        query += filterOn[filterOn.length - 1] + " LIKE '%" + filterString + "%'";
    }
    else {
        query = `SELECT * FROM student WHERE uid='${sid}'`;

    }
    conn.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.send({ "sts": "failure" });
        }
        else {
            const respData = sid === undefined ? result : result[0];
            res.send({ "sts": "success", "data": respData });
        }
    })
})






//returns whether a student has applied to a particular recruiter or not
router.get('/getAppliedStatus', (req, res) => {
    const sid = req.query.sid;
    const rid = req.query.rid;

    conn.query('SELECT * FROM applied WHERE sid=? AND rid=?', [sid, rid], (err, result) => {
        if (err) {
            console.log(err);
            res.send({ "sts": "failure" });
        }
        else {
            if (result.length > 0) {
                res.send({ "sts": "success", "data": true });
            }
            else {
                res.send({ "sts": "success", "data": false });
            }
        }
    })
})


// apply for a particular recruiter
router.post('/apply', (req, res) => {
    const sid = req.body.sid;
    const rid = req.body.rid;
    const appliedTime = req.body.appliedTime;
    conn.query('INSERT INTO applied (sid, rid, appliedTime) values (?, ?, ?)', [sid, rid, appliedTime], (err, result) => {
        if (err) {
            console.log(err);
            res.send({ "sts": "failure" });
        }
        else {
            res.send({ "sts": "success" });
        }
    })

})


//returns all the applied recruiters for a particular student
router.get('/getApplied', (req, res) => {
    const sid = req.query.sid;
    const query = "SELECT * FROM recruiter R WHERE R.id IN (SELECT A.rid FROM applied A WHERE A.sid = ?)";
    conn.query(query, [sid], (err, result) => {
        if (err) {
            console.log(err);
            res.send({ "sts": "failure" });
        }
        else {
            res.send({ "sts": "success", "data": result });
        }
    });
})



router.patch('/updatePlacedAt/:id', (req, res) => {
    const placedAt = req.body.placedAt;
    const id = req.params.id;
    conn.query('UPDATE student SET placedAt = ? WHERE uid = ?', [placedAt, id], (err, result) => {
        if (err) {
            console.log(err);
            res.send({ "sts": "failure" });
        }
        else {
            res.send({ "sts": "success" });
        }
    })
})


router.get('/getPlacementStatus/:id', (req, res) => {
    const id = req.params.id;
    conn.query('SELECT placedAt from student WHERE uid = ?', [id], (err, result) => {
        if (err) {
            console.log(err);
            res.send({ "sts": "failure" });
        }
        else {
            var sts = result[0].placedAt === null ? false : true
            res.send({ "sts": "success", data: sts });
        }
    })
})



router.get('/getResume/:id', (req, res) => {
    const sid = req.params.id;
    conn.query('SELECT * FROM resume WHERE sid = ?', [sid], (err, result) => {
        if (err) {
            console.log(err);
            res.send({ "sts": "failure" });
        }
        else {
            // console.log(result[0])
            if (result.length > 0) {
                var buff = new Buffer.from(result[0].data)
                res.send({ "sts": "success", "data": buff });
            }
            else {
                res.send({ "sts": "success", "data": null });
            }
        }
    })
})

module.exports = router