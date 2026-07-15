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

app.get('/biodata', (req, res) => {
    pool.query('SELECT * FROM biodata')
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error');
        });
});

app.get('/biodata/:id', (req, res) => {
    const { id } = req.params;
    pool.query('SELECT * FROM biodata WHERE id = $1', [id])
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).send('Data tidak ditemukan');
            }
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error');
        });
});

app.post('/biodata', (req, res) => {
    const { nama, nim, kelas } = req.body;

    pool.query(
        'INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *',
        [nama, nim, kelas]
    )
        .then((result) => {
            res.status(201).json(result.rows[0]);
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error');
        });
});

app.put('/biodata/:id', (req, res) => {
    const { id } = req.params;
    const { nama, nim, kelas } = req.body;

    pool.query(
        'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
        [nama, nim, kelas, id]
    )
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).send('Data tidak ditemukan');
            }
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error');
        });
});

app.delete('/biodata/:id', (req, res) => {
    const { id } = req.params;
    
    pool.query('DELETE FROM biodata WHERE id = $1 RETURNING *', [id])
        .then((result) => {
            if (result.rows.length === 0) {
                return res.status(404).send('Data tidak ditemukan');
            }
            res.json({ message: 'Data berhasil dihapus', data: result.rows[0] });
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error');
        });
});

app.listen(port, () => {
    console.log(`App is running on port ${port}.`);
});
