const express = require('express');
const path = require('path');

const bodyParser = require('body-parser');
const methodOverride = require ('express-method-override');
const mysql = require('mysql');

const app = express();


// set the view engine to pug
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// MySQL
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: ''
});

connection.connect((err) => {
    if(err) {
        throw err;
    } 
    console.log("Connection done");
});

//Datenbank 'aframe' erstellen
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE aframe';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        console.log("result");
        res.send("Database created");
    });
});

//Tabelle 'score' erstellen
app.get('/createtable', (req, res) => {
    let sql = 'CREATE TABLE aframe.score(firstname varchar(255) NOT NULL, lastname varchar(255) NOT NULL, gamertag varchar(255) NOT NULL, score int NOT NULL)';
    connection.query(sql, (err, result) => {
        if(err) throw err;
        console.log("result");
        res.send("Table score created");
    });
});

app.get('/createplayers', (req, res) => {
    let sql = "INSERT INTO aframe.score (firstname, lastname, gamertag, score) VALUES " + 
              "('Anna', 'Schmidt', 'annaXx5', '125'), " +
              "('Tom', 'Wagner', 'toom77', '562'), " +
              "('Maria', 'Winter', 'mar_63', '845'), " +
              "('Jan', 'Sommer', 'JaSo333', '359')";
    connection.query(sql, (err, result) => {
        if(err) throw err;
        res.send("Players created");
    });
});


//User anzeigen
app.get('/', (req, res) => {
    connection.query('SELECT * FROM aframe.score', function(err, results, fields) {
        if(err) throw err;
        var data = "";
        for (var i = 0; i < results.length; i++) {
            data = data.concat(results[i].firstname + "    ");
            data = data.concat(results[i].lastname + "    ");
            data = data.concat(results[i].gamertag + "    ");
            data = data.concat(results[i].score + "\n");
        }
        res.render('index', { data });
    });
});

// Listen on port 8081
var server = app.listen('8081', function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Server is successfully running on port 8081");
});
