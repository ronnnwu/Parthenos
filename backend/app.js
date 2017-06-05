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
                let senityCheck = 0;

                while (soln.length === 0 || senityCheck === 0) {
                    senityCheck = 1;
                    let ansInsert = [];
                    str = rows[i].statement.toString();

                    while (str.indexOf('<code>') > -1) {
                        let randomNum = randomIntInc(10, 25);
                        ansInsert.push(randomNum);
                        str = str.replace('<code>', randomNum);
                    } //replace numeric with random numbers

                    for (let i = 0; i < 15; i = i + 6) {

                        if ((ansInsert[i] === ansInsert[i + 2] &&  ansInsert[i + 1] === ansInsert[i + 3]) ||
                            (ansInsert[i + 2] === ansInsert[i + 4] && ansInsert[i + 3] === ansInsert[i + 5]) ||
                            (ansInsert[i] === ansInsert[i + 4] && ansInsert[i + 1] === ansInsert[i + 5])) {

                            senityCheck = 0;
                            continue;
                        }
                    } //check if two players are identical

                    if (senityCheck === 0) {
                        continue;
                    }



                    let max_point = 0;
                    let min_money = 0;

                    for (let i = 0; i <= 4; i = i + 2) {
                        for (let j = 6; j <= 10; j = j + 2) {
                            for (let k = 12; k <= 16; k = k + 2) {
                                let tot_money = ansInsert[i + 1] + ansInsert[j + 1] + ansInsert[k + 1];
                                if (tot_money <= 50) {
                                    let totPoint = ansInsert[i] + ansInsert[j] + ansInsert[k];
                                    if (totPoint === max_point) {
                                        if (min_money > tot_money) {
                                            min_money = tot_money;
                                            soln = [[i / 2, (j - 6) / 2, (k - 12) / 2]];
                                        }
                                        else if (min_money === tot_money) {
                                            soln.push([i / 2, (j - 6) / 2, (k - 12) / 2]);
                                        }
                                    }
                                    else if (totPoint > max_point) {
                                        max_point = totPoint;
                                        min_money = tot_money;
                                        soln = [[i / 2, (j - 6) / 2, (k - 12) / 2]];
                                    }
                                }
                            }
                        }


                    } // find solution if no solution exists makes another problem
                } //find at least one solution
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
            }//

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
