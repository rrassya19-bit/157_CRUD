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