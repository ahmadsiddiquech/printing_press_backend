//libraries
const express = require('express');
const pool = require('../config/db.js');
const Joi = require('joi');

const router = express.Router();

//libraries end

// users registrtion api's start

router.get('/', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM "user_addresses" ORDER BY id asc');
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
        const users = await pool.query('SELECT * FROM "user_addresses" WHERE user_id = $1', [id]);
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
        // const result = validateAddress(user);

        // if(result.error){
        //     res.status(400).json(result.error.details[0].message);
        //     return;
        // }
        const users = await pool.query('INSERT INTO "user_addresses" (user_id,contact_name,company_name,phone,address,state,postcode,country,billing_address,delivery_address) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)', [user.user_id, user.contact_name, user.company_name, user.phone, user.address, user.state, user.postcode, user.country, user.billing_address, user.delivery_address]);
        if (users.rowCount >= 1) {
            res.json({
                success: true,
                message: " Succesfull",
                data: ""
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

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        var user = req.body;

        var cols = [];
        for (const [key, value] of Object.entries(user)) {
            cols.push(key + " = '" + value + "'");
        }
        const update = await pool.query("UPDATE categories SET " + cols.join(', ') + " WHERE id = $1 returning *", [id]);
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


router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const users = await pool.query('DELETE FROM "user_addresses" WHERE id = $1', [id]);
        if (users.rowCount > 0) {
            res.json({
                success: true,
                message: " Deleted Succesfully",
                data: ""
            });
        } else {
            res.json({
                success: false,
                message: "Not Deleted",
                data: ""
            });
        }

    } catch (error) {
        res.json(error.message);
    }
});

router.get('/get_default_billing_address/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const users = await pool.query('SELECT * FROM "user_addresses" WHERE user_id = $1 and billing_address = $2', [id, 1]);
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

router.get('/get_default_delivery_address/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const users = await pool.query('SELECT * FROM "user_addresses" WHERE user_id = $1 and delivery_address = $2', [id, 1]);
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

router.put('/set_default_billing_address/:id', async (req, res) => {
    try {
        const id = req.params.id;
        var body = req.body;
        var update = await pool.query("UPDATE user_addresses SET billing_address = $1 WHERE user_id = $2", [0, body.user_id]);
        update = await pool.query("UPDATE user_addresses SET billing_address = $1 WHERE id = $2 returning *", [1, id]);
        if (update.rowCount >= 1) {
            res.json({
                success: true,
                message: "Billing Address Changed",
                data: update.rows[0]
            });
        } else {
            res.json({
                success: false,
                message: "Unsuccesful",
                data: ""
            });
        }
    } catch (error) {
        res.json(error.message);
    }
});

router.put('/set_default_delivery_address/:id', async (req, res) => {
    try {
        const id = req.params.id;
        var body = req.body;
        var update = await pool.query("UPDATE user_addresses SET delivery_address = $1 WHERE user_id = $2", [0, body.user_id]);
        update = await pool.query("UPDATE user_addresses SET delivery_address = $1 WHERE id = $2 returning *", [1, id]);
        if (update.rowCount >= 1) {
            res.json({
                success: true,
                message: "Delivery Address Changed",
                data: update.rows[0]
            });
        } else {
            res.json({
                success: false,
                message: "Unsuccesful",
                data: ""
            });
        }
    } catch (error) {
        res.json(error.message);
    }
});

// users registrtion api's end

function validateCategory(user) {
    const schema = Joi.object({
        category: Joi.string().required(),
        description: Joi.string().required()
    })

    return schema.validate(user);
}


//validation function ends

module.exports = router;