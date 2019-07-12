const {
    redisHost, redisPort, 
    pgHost, pgPort, pgDatabase, pgUser, pgPassword,
} = require('./keys');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const {Pool} = require('pg');
const pgClient = new Pool({
    host: pgHost,
    port: pgPort,
    user: pgUser,
    database: pgDatabase, 
    password: pgPassword,
});
pgClient.on('error', () => {console.log('Lost PG connection')});

pgClient.query('CREATE TABLE IF NOT EXIST values (number INT)')
    .catch(err => {console.error(err)});

const redis = require('redis');
const redisClient = redis.createClient({
    host: redisHost,
    port: redisPort,
    retry_strategy: () => 1000,
});
const redisPublisher = redisClient.duplicate();

app.get('/', (req, res) => {
    res.send('Hi');
});

app.get('/values/all', async (req, res) => {
    const {rows} = await pgClient.query('SELECT * from values');
    res.send(rows);
});

app.get('/values/current', async (req, res) => {
    redisClient.hgetall('values', (err, values) => {
        if (err) {
            res.send(err.message);
        } else {
            res.send(values);
        }
    });
});

app.post('/values', async (req, res) => {
    const {index} = req.body;
    if (parseInt(index) > 40) {
        res.status(422).send('Index too high');
    } else {
        redisClient.hset('values', index, 'Nothing yet!');
        redisPublisher.publish('insert', index);
        pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);
        res.send({working: true});
    }
});

app.listen(5000, err => {console.log('Server is listening on port 5000')});



