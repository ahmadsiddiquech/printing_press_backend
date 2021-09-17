//libraries
const express = require('express');
const pool = require('../config/db.js');
const Joi = require('joi');

const router = express.Router();
const upload_url = "E:/Angular/printingshop/uploads/images/";
const front_server_url = "http://localhost:4200/";

//libraries end

// users registrtion api's start

// Extended: https://swagger.io/specification/#infoObject




router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // const users = await pool.query(`SELECT * FROM "orders" WHERE orders.user_id = $1`, [id]);
        const users = await pool.query(`SELECT orders.*,b.contact_name,b.company_name,b.address,b.state,b.postcode,b.phone,b.country,d.contact_name d_contact_name,d.company_name d_company_name,d.address d_address,d.state d_state,d.postcode d_postcode,d.phone d_phone,d.country d_country FROM "orders" LEFT JOIN "user_addresses" as b ON orders.billing_address = b.id LEFT JOIN "user_addresses" as d ON orders.delivery_address = d.id WHERE orders.user_id = $1`, [id]);

        if (users.rowCount >= 1) {
            res.json({
                success: true,
                message: "",
                data: users.rows
            });
        } else {
            res.json({
                success: false,
                message: "Record Not Found",
                data: ""
            });
        }
    } catch (error) {
        res.json(error.message);
    }
});

router.post('/', async (req, res) => {
    try {
        const user = req.body;
        var datetime = new Date();
        datetime = datetime.toISOString().slice(0, 10);

        const users = await pool.query('INSERT INTO "orders" (user_id,delivery_address,billing_address,total_price,order_status,order_date) VALUES ($1,$2,$3,$4,$5,$6) returning *', [user.user_id, user.billing_address, user.delivery_address, user.total_price, 'Pending', datetime]);


        if (users.rowCount >= 1) {
            user.order_products.forEach(async element => {
                const users1 = await pool.query('INSERT INTO "order_products" (order_id,product_id,turnaround,product_design) VALUES ($1,$2,$3,$4)', [users.rows[0].id, element.product_id, element.product_turnaround, "null"]);
            });
            res.json({
                success: true,
                message: " Succesfull",
                data: users.rows[0]
            });
        } else {
            res.json({
                success: false,
                message: " Failed",
                data: ""
            });
        }
    } catch (error) {
        res.json(error.message);
    }
});

module.exports = router;