const Pool = require('pg').Pool;

const pool = new Pool({
    user: "mbbxyimy_binary",
    password: "i*49ry1B*Mk]",
    database: "mbbxyimy_printingpress",
    host: "162.241.244.49gir",
    port: 5432
});

module.exports = pool;