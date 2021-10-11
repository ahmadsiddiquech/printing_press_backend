const Pool = require('pg').Pool;

const pool = new Pool({
    user: "msounghvmitbiq",
    password: "5853501d496191c19f244e1feedca6ebf7083747f777a018d6bcc06a1f4c2602",
    database: "d2ktmkuinpf4i2",
    host: "ec2-107-20-24-247.compute-1.amazonaws.com",
    port: 5432
});

module.exports = pool;