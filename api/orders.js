//libraries
const express = require('express');
const pool = require('../config/db.js');
const Joi = require('joi');

const router = express.Router();
const upload_url = "https://printingpressweb.herokuapp.com/uploads/images/";
const front_server_url = "https://printingpressweb.herokuapp.com/";

//libraries end

// users registrtion api's startsss

router.get('/', async (req, res) => {
    try {
        const users = await pool.query(`SELECT orders.*,users.first_name,users.last_name FROM "orders" LEFT JOIN "users" ON orders.user_id = users.id ORDER BY orders.id desc`);

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

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        // const users = await pool.query(`SELECT * FROM "orders" WHERE orders.user_id = $1`, [id]);
        const users = await pool.query(`SELECT orders.*,b.contact_name,b.company_name,b.address,b.state,b.postcode,b.phone,b.country,d.contact_name d_contact_name,d.company_name d_company_name,d.address d_address,d.state d_state,d.postcode d_postcode,d.phone d_phone,d.country d_country FROM "orders" LEFT JOIN "user_addresses" as b ON orders.billing_address = b.id LEFT JOIN "user_addresses" as d ON orders.delivery_address = d.id WHERE orders.user_id = $1 ORDER BY orders.id desc`, [id]);

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

router.get('/order_by_order_id/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.query;
        // const users = await pool.query(`SELECT * FROM "orders" WHERE orders.user_id = $1`, [id]);
        const users = await pool.query(`SELECT orders.*,b.contact_name,b.company_name,b.address,b.state,b.postcode,b.phone,b.country,d.contact_name d_contact_name,d.company_name d_company_name,d.address d_address,d.state d_state,d.postcode d_postcode,d.phone d_phone,d.country d_country FROM "orders" LEFT JOIN "user_addresses" as b ON orders.billing_address = b.id LEFT JOIN "user_addresses" as d ON orders.delivery_address = d.id WHERE orders.user_id = $1 AND orders.id = $2 ORDER BY orders.id desc`, [body.user_id, id]);
        const data = users.rows[0];
        const query = await pool.query(`SELECT product_options.* FROM "order_products" LEFT JOIN "product_options" ON order_products.product_id = product_options.product_id WHERE order_products.order_id = $1 ORDER BY order_products.id desc`, [data.id]);
        data.products = query.rows;
        if (users.rowCount >= 1) {
            res.json({
                success: true,
                message: "",
                data: data
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

router.put('/upload_designs/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.query;

        let sampleFile;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Record Not Updated",
                data: ""
            });
        }

        sampleFile = req.files.design;
        uploadPath = upload_url + sampleFile.name;

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
        });

        const update = await pool.query("UPDATE order_products SET product_design = $1 WHERE order_id = $2 and product_id = $3 and turnaround = $4", [sampleFile.name, id, body.product_id, body.product_turnaround]);
        if (update.rowCount >= 1) {
            res.json({
                success: true,
                message: "Record Updated Succesfully",
                data: update.rows[0]
            });
        } else {
            res.json({
                success: false,
                message: "Update Failed",
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

        const users = await pool.query('INSERT INTO "orders" (user_id,delivery_address,billing_address,delivery,items_price,delivery_fee,total_price,order_status,order_date) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) returning *', [user.user_id, user.billing_address, user.delivery_address, user.delivery, user.items_price, user.delivery_fee, user.total_price, 'Pending', datetime]);


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