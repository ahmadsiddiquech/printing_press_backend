const Pool = require('pg').Pool;

const pool = new Pool({
    user: "mzshaclvprkqtk",
    password: "2a7a4d981143b9859c9727c81434a9a3da6beb36a9bb21b86ce9640188a81c3b",
    database: "d6a53id3a5ajus",
    host: "ec2-54-173-31-84.compute-1.amazonaws.com",
    port: "5432",
});

module.exports = pool;