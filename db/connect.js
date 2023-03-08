require('dotenv').config();
const Pool = require('pg').Pool

const pool = new Pool({
    user: "postgres",
    password: process.env.PASSWORD,
    port: 5432,
    database: "store_api"
})

module.exports = pool