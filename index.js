import express from 'express';   // Import library express untuk membuat server API
import pg from 'pg';             // Import library pg untuk koneksi ke database PostgreSQL


const app = express();          // Membuat instance aplikasi express
const port = 3000;              // Menentukan port server akan berjalan
const { Pool } = pg;            // Mengambil class Pool dari pg (Pool = kumpulan koneksi database)


app.use (express.json());       // Middleware untuk membaca data JSON dari body request

// Middleware untuk membaca data form-urlencoded dari body request
app.use(
    express.urlencoded({ 
        extended: true         // mengizinkan tipe data kompleks (array/objek)
    })
)

// Membuat koneksi pool ke database PostgreSQL
const pool = new pg.Pool({
    user: 'postgres',         // username database
    host: 'localhost',        // host database (localhost = komputer sendiri)
    database: 'mahasiswa',    // nama database yang digunakan
    password: 'rassya100407', // password database
    port: 5432,               // port default PostgreSQL
});

// ===== ENDPOINT: Route utama (/) =====
// Method: GET
// Fungsi: Menampilkan semua data dari tabel biodata (untuk test)
app.get('/', (req, res) => {
    console.log('TEST DATA');
    pool.query('SELECT * FROM biodata') // query SQL ambil semua data
        .then((testdata) => {
            console.log(testdata.rows); // cetak data ke console
            res.json(testdata.rows);    // kirim data sebagai JSON
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error'); 
        });
});

// ===== ENDPOINT: GET semua biodata =====
// Method: GET
// URL: /biodata
// Fungsi: Mengambil seluruh data biodata
app.get('/biodata', (req, res) => {
    pool.query('SELECT * FROM biodata') // query SELECT semua data
        .then((result) => {
            res.json(result.rows);     // kirim hasil sebagai JSON (array)
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error');
        });
});

// ===== ENDPOINT: GET biodata by ID =====
// Method: GET
// URL: /biodata/:id  (contoh: /biodata/1)
// Fungsi: Mengambil satu data biodata berdasarkan id
app.get('/biodata/:id', (req, res) => {
    const { id } = req.params;                              // ambil id dari URL parameter
    pool.query('SELECT * FROM biodata WHERE id = $1', [id]) // $1 = placeholder untuk id (cegah SQL injection)
        .then((result) => {
            if (result.rows.length === 0) {                 // jika tidak ada data
                return res.status(404).send('Data tidak ditemukan');
            }
            res.json(result.rows[0]);                       // kirim data pertama (objek, bukan array)
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error');
        });
});

// ===== ENDPOINT: POST tambah biodata =====
// Method: POST
// URL: /biodata
// Fungsi: Menambahkan data baru ke tabel biodata
app.post('/biodata', (req, res) => {
    const { nama, nim, kelas } = req.body; // ambil data dari body request (dikirim via JSON/form)

    // query INSERT dengan RETURNING * agar data yang baru dimasukkan langsung dikembalikan
    pool.query(
        'INSERT INTO biodata (nama, nim, kelas) VALUES ($1, $2, $3) RETURNING *',
        [nama, nim, kelas]                 // nilai placeholder $1-$3
    )
        .then((result) => {
            res.status(201).json(result.rows[0]); // status 201 = Created
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error');
        });
});

// ===== ENDPOINT: PUT update biodata =====
// Method: PUT
// URL: /biodata/:id
// Fungsi: Mengupdate data biodata berdasarkan id
app.put('/biodata/:id', (req, res) => {
    const { id } = req.params;                   // ambil id dari URL
    const { nama, nim, kelas } = req.body;       // ambil data baru dari body

    // query UPDATE dengan WHERE id = $4 untuk update data spesifik
    pool.query(
        'UPDATE biodata SET nama = $1, nim = $2, kelas = $3 WHERE id = $4 RETURNING *',
        [nama, nim, kelas, id] // $1-$3 data baru, $4 = id
    )
        .then((result) => {
            if (result.rows.length === 0) {    // jika id tidak ditemukan
                return res.status(404).send('Data tidak ditemukan');
            }
            res.json(result.rows[0]);          // kirim data yang sudah diupdate
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error');
        });
});

// ===== ENDPOINT: DELETE biodata =====
// Method: DELETE
// URL: /biodata/:id
// Fungsi: Menghapus data biodata berdasarkan id
app.delete('/biodata/:id', (req, res) => {
    const { id } = req.params; // ambil id dari URL
    
    // query DELETE dengan RETURNING * agar data yang dihapus dikembalikan
    pool.query('DELETE FROM biodata WHERE id = $1 RETURNING *', [id])
        .then((result) => {
            if (result.rows.length === 0) { // jika id tidak ditemukan
                return res.status(404).send('Data tidak ditemukan');
            }
            res.json({ message: 'Data berhasil dihapus', data: result.rows[0] });
        })
        .catch((err) => {
            console.error('Error executing query', err.stack);
            res.status(500).send('Internal Server Error');
        });
});

// Menjalankan server pada port yang ditentukan
app.listen(port, () => {
    console.log(`App is running on port ${port}.`);
});