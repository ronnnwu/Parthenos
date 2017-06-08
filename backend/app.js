'use strict';

let http = require('http'),
    //for Cross-origin resource sharing so that frontend app can use as javascript code sources
    cors = require('cors'),
    //for post api
    bodyParser = require('body-parser'),
    //for router
    express = require('express'),
    app = express()

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//mysql database store contest problems
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

//inject function to asyc call, because node is async (multithreads) and return and promise
const getProblem = function(callback) {

    mysqlServer.query('SELECT * FROM problem WHERE id = 1', function(err, rows, fields) {

        if (!err)
            return callback(null, rows);
        else
            return callback('Cannot connect to db');
    });
}

const getCompetition = function(callback) {

    mysqlServer.query('SELECT * FROM competition WHERE id = 1', function(err, rows, fields) {

        if (!err)
            return callback(null, rows);
        else
            return callback('Cannot connect to db');
    });
}

//home page get
app.get('/', (req, res) => {
    res.send('This is the Parthenos REST API backend' );
});

//a random integer generated between low and high inclusive
function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

//API
//only two are currently working
// "/tutorial/1" and "/competition/1"
app.get('/:subject/:id', (req, res, next) => {

    if (req.params['subject'] === 'tutorial' && req.params['id'] === '1') {

        getProblem((err, rows) => {
            if (err) {
                return next(err);
            }

            //if I had time, this part should be re-factored
            let objs = [];
            for (let i in rows) {

                let soln = [];
                let str;
                let senityCheck = 0;

                //inject random numbers to the problem statement, stop until the problem is
                //well defined, i.e. has a solution
                       while (soln.length === 0 || senityCheck === 0) {
                    senityCheck = 1;
                    let ansInsert = [];
                    str = rows[i].statement.toString();

                    while (str.indexOf('<code>') > -1) {
                        let randomNum = randomIntInc(10, 25);
                        ansInsert.push(randomNum);
                        str = str.replace('<code>', randomNum);
                    } //replace numeric with random numbers

                   //senityCheck is to check if the problem contents identical players
                   // with same points and same paid in the same role, thus no the problem itself becomes no interesting.
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

                    //this part calculate solutions for the problem, if no solution is found, the problem
                    // will be re-generated
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
    //the second API "/competition/1"
    else if (req.params['subject'] === 'competition' && req.params['id'] === '1'){
        getCompetition( (err, rows) => {
            if (err) {
                return next(err);
            }
            let objs = [];
            for (let i in rows) {
                objs.push({
                    id: rows[i].id,
                    title: rows[i].title,
                    statement: rows[i].statement
                });
            }

            res.json(objs);
        });
    }
    else {
        res.send('API no matches');
    }

});

//the node-compilex is deprecated and unsafe, because it is running in the same operating system
//if i have time, i will create docker container to run the code
let compiler = require('compilex');
compiler.init();

let envData = { OS : "linux"};


//POST API interpret Python code
app.post('/python', (req, res) => {
    compiler.compilePython(envData , req.body.code , function(data){
        res.send(data);
        //console.log(req);
        //console.log(data);
    });
});

//compile CPP code. It first saves the code to the dics, then compile it, then run it
//if I have time, i will compile the code directly in memory and return stdout to the request.
app.post('/cpp', (req, res) => {
    let code = req.body.code;
    const fs = require('fs');
    fs.writeFile("temp/filename.cpp", code, () => {
        const exec = require('child_process').exec;
        const child = exec('g++ temp/filename.cpp -o temp/output.out',  (e, cout, sterr) => {
            if (sterr){
                console.log(sterr);
                const data = {
                    output: cout,
                    error: sterr
                };
                res.send(data); //return if it cannot even compile
            }
            else{
                const exec2 = require('child_process').exec;
                const child2 = exec2('temp/output.out', (err, stdout, stderr) => {
                    const data = {
                        output: stdout,
                        error: stderr
                    };
                    res.send(data);
                });
            }
        });
    });
});


//same as CPP compiler
app.post('/java', (req, res) => {
    let code = req.body.code;
    const fs = require('fs');
    fs.writeFile("temp/main.java", code, () => {
        const exec = require('child_process').exec;
        const child = exec('javac temp/main.java',  (e, cout, sterr) => {
            if (sterr){
                console.log(sterr);
                const data = {
                    output: cout,
                    error: sterr
                };
                res.send(data);  //return if it cannot even compile
            }
            else{
                const exec2 = require('child_process').exec;
                const child2 = exec2('cd temp; java main', (err, stdout, stderr) => {
                    const data = {
                        output: stdout,
                        error: stderr
                    };
                    res.send(data);
                });
            }
        });
    });
});

//Go is interesting. It compiles and runs at the same time and its error msg and stdout uses the same channel
app.post('/go', (req, res) => {
    let code = req.body.code;
    const fs = require('fs');
    fs.writeFile("temp/test.go", code, () => {
        const exec = require('child_process').exec;
        const child = exec('go run temp/test.go',  (e, sterr, cout) => {
            let data;
            if (e){
                data = {
                    error: cout
                };
            }
            else{
                data = {
                    output: cout
                };
            }
            res.send(data);
        });
    });
});

//AWS nodejs uses 8081 port which is a proxy to 80
app.listen(process.env.PORT || 3000);
