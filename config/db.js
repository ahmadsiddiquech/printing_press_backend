const Pool = require('pg').Pool;

const pool = new Pool({
    user : "postgres",
    password : "123",
    database : "printing_press",
    host : "localhost",
    port : 5432
});

module.exports = pool;