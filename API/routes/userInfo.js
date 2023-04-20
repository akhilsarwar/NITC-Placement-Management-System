const express = require('express');
const router = express.Router()
const conn = require('../db');

router.use((req, res, next) => {
    console.log('ROUTE [USER INFO]: ')
    console.log((req.method).toUpperCase() + ': ' + req.url)
    next()
})

router.get('/:id', (req, res) => {
    const id = req.params.id;
    const role = req.query.role;
    let query = "";
    if (role === "Student") {
        query = `SELECT * FROM student WHERE uid='${id}'`;
    }
    else {
        query = `SELECT * FROM pc WHERE uid = '${id}'`;
    }
    conn.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.send({ sts: "failure" });
        }
        else {
            res.send({ sts: "success", data: result[0] });
        }

    });
})


//response body is a json object {sts: failure} or {sts: success}
router.post('/update/:id', (req, res) => {
    const data = req.body;
    const id = req.params.id;
    const role = data.role;
    console.log(data)
    console.log(req.files)


    if (role === "Student") {

        conn.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                res.send({ "sts": "failure" });
            }

            conn.query(`SELECT uid FROM student WHERE uid=?`, [id], (err, result) => {
                if (err) {
                    console.log(err);
                    res.send({ "sts": "failure" });
                    return conn.rollback(function () {
                        console.log('Rolling Back the transaction');
                    })
                }
                if (result.length > 0) {

                    //update the profile
                    conn.query(`UPDATE student SET name=?, rollNo=?, email=?, cgpa=?, address=?, contact=?, stream=?, branch=?, dob=?, placedAt=? WHERE uid=?`, [data.name, data.rollNo, data.email, data.cgpa, data.address, data.contact, data.stream, data.branch, data.dob, data.placedAt, id], (err, result) => {
                        if (err) {

                            console.log(err);
                            res.send({ "sts": "failure" });
                            return conn.rollback(function () {
                                console.log('Rolling Back the transaction');
                            })

                        }
                        else {
                            const resumeFile = req.files.resume;
                            if (resumeFile !== null) {
                                conn.query(`DELETE FROM resume WHERE sid=?`, [id], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.send({ "sts": "failure" });
                                        return conn.rollback(function () {
                                            console.log('Rolling Back the transaction');
                                        })
                                    }
                                    else {
                                        console.log('Delete resume Successful')
                                        conn.query(`INSERT INTO resume (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, resumeFile.name, resumeFile.data, resumeFile.size, resumeFile.encoding, resumeFile.mimetype], (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                res.send({ "sts": "failure" });
                                                return conn.rollback(function () {
                                                    console.log('Rolling Back the transaction');
                                                })
                                            }
                                            console.log('Insert resume Successful')
                                            const profileImage = req.files.profileImage;
                                            if (profileImage !== null) {
                                                conn.query(`DELETE FROM profileimage WHERE sid=?`, [id], (err, result) => {
                                                    if (err) {
                                                        console.log(err);
                                                        res.send({ "sts": "failure" });
                                                        return conn.rollback(function () {
                                                            console.log('Rolling Back the transaction');
                                                        })
                                                    }
                                                    console.log('Delete Profile Image Successful')
                                                    conn.query(`INSERT INTO profileimage (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, profileImage.name, profileImage.data, profileImage.size, profileImage.encoding, profileImage.mimetype], (err, result) => {
                                                        if (err) {
                                                            console.log(err);
                                                            res.send({ "sts": "failure" });
                                                            return conn.rollback(function () {
                                                                console.log('Rolling Back the transaction');
                                                            })
                                                        }

                                                        console.log('Insert Profile Image Successful')
                                                        conn.commit(function (err) {
                                                            if (err) {
                                                                console.log(err);
                                                                res.send({ "sts": "failure" });
                                                                return conn.rollback(function () {
                                                                    console.log('Rolling Back the transaction');
                                                                })
                                                            }
                                                            console.log('Profile Updation [Change existing] Success');
                                                            res.send({ "sts": "success" });
                                                        });

                                                    })
                                                })
                                            }

                                            else {
                                                conn.commit(function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                        res.send({ "sts": "failure" });
                                                        return conn.rollback(function () {
                                                            console.log('Rolling Back the transaction');
                                                        })
                                                    }
                                                    console.log('Profile Updation [Change existing] Success');
                                                    res.send({ "sts": "success" });
                                                });
                                            }

                                        })
                                    }
                                })

                            }
                            else {
                                conn.commit(function (err) {
                                    if (err) {
                                        console.log(err);
                                        res.send({ "sts": "failure" });
                                        return conn.rollback(function () {
                                            console.log('Rolling Back the transaction');
                                        })
                                    }
                                    console.log('Profile Updation [Change existing] Success');
                                    res.send({ "sts": "success" });
                                });
                            }
                        }
                    })
                }
                else {
                    //insert a new profile
                    conn.query(`INSERT INTO student (uid, name, rollNo, email, cgpa, address, contact, stream, branch, dob, placedAt) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?)`, [id, data.name, data.rollNo, data.email, data.cgpa, data.address, data.contact, data.stream, data.branch, data.dob, data.placedAt], (err, result) => {
                        if (err) {
                            console.log(err);
                            res.send({ "sts": "failure" });
                            return conn.rollback(function () {
                                console.log('Rolling Back the transaction');
                            })
                        }
                        else {
                            console.log('Details Updation Successful')

                            //add resume to the resume table
                            const resumeFile = req.files.resume;

                            conn.query(`INSERT INTO resume (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, resumeFile.name, resumeFile.data, resumeFile.size, resumeFile.encoding, resumeFile.mimetype], (err, result) => {
                                if (err) {
                                    console.log(err);
                                    res.send({ "sts": "failure" });
                                    return conn.rollback(function () {
                                        console.log('Rolling Back the transaction');
                                    })
                                }

                                console.log('Insert resume Successful')
                                const profileImage = req.files.profileImage;
                                conn.query(`INSERT INTO profileimage (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, profileImage.name, profileImage.data, profileImage.size, profileImage.encoding, profileImage.mimetype], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.send({ "sts": "failure" });
                                        return conn.rollback(function () {
                                            console.log('Rolling Back the transaction');
                                        })
                                    }

                                    console.log('Insert Profile Image Successful')
                                    conn.commit(function (err) {
                                        if (err) {
                                            console.log(err);
                                            res.send({ "sts": "failure" });
                                            return conn.rollback(function () {
                                                console.log('Rolling Back the transaction');
                                            })
                                        }
                                        console.log('Profile Updation [Change existing] Success');
                                        res.send({ "sts": "success" });
                                    });
                                })
                            })
                        }
                    });
                }

            });
        })


    }
    else if (role === "Placement Coordinator") {
        console.log('here')
        conn.beginTransaction(function (err) {
            if (err) {
                console.log(err);
                res.send({ "sts": "failure" });
            }

            conn.query(`SELECT uid FROM pc WHERE uid=?`, [id], (err, result) => {
                if (err) {
                    console.log(err);
                    res.send({ "sts": "failure" });
                    return conn.rollback(function () {
                        console.log('Rolling Back the transaction');
                    })
                }
                if (result.length > 0) {
                    //update the profile
                    conn.query(`UPDATE pc SET name=?, email=?, address=?, contact=?, dob=?, department=?, post=? WHERE uid=?`, [data.name, data.email, data.address, data.contact, data.dob, data.department, data.post, id], (err, result) => {
                        if (err) {
                            console.log(err);
                            res.send({ "sts": "failure" });
                            return conn.rollback(function () {
                                console.log('Rolling Back the transaction');
                            })
                        }

                        console.log('Details Updation Successful')
                        const profileImage = req.files.profileImage;
                        if (profileImage !== null) {
                            conn.query(`DELETE FROM profileimage WHERE sid=?`, [id], (err, result) => {
                                if (err) {
                                    console.log(err);
                                    res.send({ "sts": "failure" });
                                    return conn.rollback(function () {
                                        console.log('Rolling Back the transaction');
                                    })
                                }

                                console.log('Delete Profile Image Successful')
                                conn.query(`INSERT INTO profileimage (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, profileImage.name, profileImage.data, profileImage.size, profileImage.encoding, profileImage.mimetype], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.send({ "sts": "failure" });
                                        return conn.rollback(function () {
                                            console.log('Rolling Back the transaction');
                                        })
                                    }

                                    console.log('Insert Profile Image Successful')
                                    conn.commit(function (err) {
                                        if (err) {
                                            console.log(err);
                                            res.send({ "sts": "failure" });
                                            return conn.rollback(function () {
                                                console.log('Rolling Back the transaction');
                                            })
                                        }
                                        console.log('Profile Updation [Change existing] Success');
                                        res.send({ "sts": "success" });
                                    });
                                })
                            })
                        }

                        else {
                            conn.commit(function (err) {
                                if (err) {
                                    console.log(err);
                                    res.send({ "sts": "failure" });
                                    return conn.rollback(function () {
                                        console.log('Rolling Back the transaction');
                                    })
                                }
                                console.log('Profile Updation [Change existing] Success');
                                res.send({ "sts": "success" });
                            });
                        }


                    })
                }
                else {
                    //insert a new profile
                    conn.query(`INSERT INTO pc (uid, name, email, address, contact, dob, department, post) values (?, ?, ?, ?, ?, ?, ?, ?)`, [id, data.name, data.email, data.address, data.contact, data.dob, data.department, data.post], (err, result) => {
                        if (err) {
                            console.log(err);
                            res.send({ "sts": "failure" });
                            return conn.rollback(function () {
                                console.log('Rolling Back the transaction');
                            })
                        }

                        console.log('Details Updation Successful')
                        const profileImage = req.files.profileImage;
                        conn.query(`INSERT INTO profileimage (sid, name, data, size, encoding, mimetype) values (?, ?, ?, ?, ?, ?)`, [id, profileImage.name, profileImage.data, profileImage.size, profileImage.encoding, profileImage.mimetype], (err, result) => {
                            if (err) {
                                console.log(err);
                                res.send({ "sts": "failure" });
                                return conn.rollback(function () {
                                    console.log('Rolling Back the transaction');
                                })
                            }

                            console.log('Insert Profile Image Successful')
                            conn.commit(function (err) {
                                if (err) {
                                    console.log(err);
                                    res.send({ "sts": "failure" });
                                    return conn.rollback(function () {
                                        console.log('Rolling Back the transaction');
                                    })
                                }
                                console.log('Profile Updation [Change existing] Success');
                                res.send({ "sts": "success" });
                            });
                        })
                    });
                }

            });

        })

    }


});


router.get('/getProfileImage/:id', (req, res) => {
    const sid = req.params.id;
    conn.query('SELECT * FROM profileimage WHERE sid = ?', [sid], (err, result) => {
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