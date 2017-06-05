'use strict';

let http = require('http'),
    cors = require('cors'),
    express = require('express'),
    app = express()

app.use(cors())

let mysql = require('mysql'), mysqlServer;

    if (1){
        mysqlServer = mysql.createConnection({
            host: process.env.RDS_HOSTNAME,
            user: process.env.RDS_USERNAME,
            password:  process.env.RDS_PASSWORD,
            port: process.env.RDS_PORT,
            database: 'Parthenos'
        });
    }
    else{
        mysqlServer = mysql.createConnection({
            host: '127.0.0.1',
            user: 'root',
            password:   '',
            port: '3306',
            database: 'Parthenos'
        });
    }


var getProblem = function(callback) {

    mysqlServer.query('SELECT * FROM problem WHERE id = 1', function(err, rows, fields) {

        if (!err)
            return callback(null, rows);
        else
            return callback('Cannot connect to db');
    });
}

app.get('/', (req, res) => {
    res.send('This is the Parthenos REST API backend')
});

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

app.get('/:subject/:id', (req, res, next) => {

    if (req.params['subject'] === 'tutorial' && req.params['id'] === '1') {

        getProblem((err, rows) => {
            if (err) {
                return next(err);
            }

            let objs = [];
            for (let i in rows) {

                let soln = [];
                let str;

                while(soln.length === 0){

                    let ansInsert = [];
                    str = rows[i].statement.toString();

                    if(str.indexOf('<code>') > -1) {
                        let randomNum = randomIntInc(10, 25);
                        ansInsert.push (randomNum);
                        result = str.replace('<code>', randomNum);
                    }

                    let max_point = 0;

                    for (let i in [0,2,4]){
                        for (let j in [6, 8, 10]){
                            for (let k in [12, 14, 16]){
                                if (ansInsert[i+1] + ansInsert[j+1] + ansInsert[k+1] <= 50){
                                    let totPoint = ansInsert[i] + ansInsert[j] + ansInsert[k];
                                    if (totPoint===max_point){
                                        solu.push([i/2,(j-6)/2,(k-12)/2]);
                                    }
                                    else if (totPoint > max_point) {
                                        soln = [ [i/2,(j-6)/2,(k-12)/2] ];
                                    }
                                }
                            }
                        }
                    }
                }

                objs.push({
                    id: rows[i].id,
                    category: rows[i].category,
                    type: rows[i].type,
                    level: rows[i].level,
                    title: rows[i].title,
                    statement: str,
                    hint: rows[i].hint,
                    solution: soln,
                });
            }

            res.json(objs);
        });
    }
    else if (req.params['subject'] === 'competition' && req.params['id'] === '1'){

    }
    else {
        res.send('API no matches');
    }

});


app.listen(process.env.PORT || 3000);
