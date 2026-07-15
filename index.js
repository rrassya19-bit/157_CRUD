import express from 'express';
import pg from 'pg';

const app = express();
const port = 3000;
const { Pool } = pg;

app.use (express.json());
app.use(
    express.urlencoded({ 
        extended: true 
    })
)

const pool = new pg.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'mahasiswa',
    password: 'rassya100407',
    port: 5432,
});

app.get('/', (req, res) => {
    console.log('TEST DATA');
    pool.query('SELECT * FROM biodata')
        .then((testdata) => {
            console.log(testdata.rows);
            res.json(testdata.rows);
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => {
    console.log(`App is running on port ${port}.`);
});