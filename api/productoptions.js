//libraries
const express = require('express');
const csv = require('fast-csv');
const fs = require('fs');
const pool = require('../config/db.js');
const Tutorial = pool.Tutorial;
const Joi = require('joi');

const router = express.Router();

// Set global directory
global.__basedir = __dirname;

// users registrtion api's start


router.post('/upload_csv/', async (req, res) => {
    try {
        var result;
        if (req.files.file == undefined) {
            return res.status(400).send({
                message: "Please upload a CSV file!"
            });
        }

        sampleFile = req.files.file
        uploadPath = __basedir + '/uploads/' + sampleFile.name;

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
        });

        // Import CSV File to MongoDB database
        let csvData = [];
        let filePath = __basedir + '/uploads/' + req.files.file.name;
        fs.createReadStream(filePath)
            .pipe(csv.parse({ headers: false }))
            .on("error", (error) => {
                throw error.message;
            })
            .on("data", async (row) => {
                try {
                    let p_id = row[0];
                    let product_id = row[1];
                    let product_type = row[2];
                    let quantity = row[3];
                    let finishing_size = row[4];
                    let printed_pages = row[5];
                    let stock = row[6];
                    let cover = row[7];
                    let lamination = row[8];
                    let one_day = row[9];
                    let two_day = row[10];
                    let three_day = row[11];
                    let seven_day = row[12];
                    let vat = row[13];
                    result = await pool.query('INSERT INTO "product_options" (p_id,product_id,product_type,quantity,finishing_size,printed_pages,stock,cover,lamination,one_day,two_day,three_day,seven_day,vat) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)', [p_id, product_id, product_type, quantity, finishing_size, printed_pages, stock, cover, lamination, one_day, two_day, three_day, seven_day, vat]);
                } catch (error) {
                    console.log("catch error-", error);
                    res.status(500).send({
                        message: "Could not upload the file: " + req.files.file.name,
                    });
                }

            })
            .on("end", async () => {
                if (result.rowCount >= 1) {
                    res.json({
                        success: true,
                        message: " Succesfull",
                        data: result.rows[0]
                    });
                } else {
                    res.json({
                        success: false,
                        message: " Failed",
                        data: ""
                    });
                }
            });
    } catch (error) {
        console.log("catch error-", error);
        res.status(500).send({
            message: "Could not upload the file: " + req.files.file.name,
        });
    }
});


router.get('/', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM "product_options" ORDER BY product_options.id asc');
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
        const users = await pool.query('SELECT product_options.*,categories.category,categories.id as category_id,subcategories.name as subcategory FROM "product_options" LEFT JOIN "subcategories" ON product_options.subcategory_id=subcategories.id LEFT JOIN "categories" ON subcategories.category_id=categories.id WHERE product_options.id = $1', [id]);
        if (users.rowCount >= 1) {
            res.json({
                success: true,
                message: "",
                data: users.rows[0]
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

router.get('/get_additionaloption_by_subcategory/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const users = await pool.query('SELECT product_options.*,categories.category,categories.id as category_id,subcategories.name as subcategory FROM "product_options" LEFT JOIN "subcategories" ON product_options.subcategory_id=subcategories.id LEFT JOIN "categories" ON subcategories.category_id=categories.id WHERE product_options.subcategory_id = $1', [id]);
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
        delete user.category_id;
        const result = validateProductoptions(user);

        if (result.error) {
            res.status(400).json(result.error.details[0].message);
            return;
        }
        const users = await pool.query('INSERT INTO "product_options" (subcategory_id,name,active,price) VALUES ($1,$2,$3,$4) returning *', [user.subcategory_id, user.name, user.active, user.price]);
        if (users.rowCount >= 1) {
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

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        var user = req.body;
        delete user.category_id;

        var cols = [];
        for (const [key, value] of Object.entries(user)) {
            cols.push(key + " = '" + value + "'");
        }
        const update = await pool.query("UPDATE product_options SET " + cols.join(', ') + " WHERE id = $1 returning *", [id]);
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
        const users = await pool.query('DELETE FROM "product_options" WHERE id = $1', [id]);
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

// users registrtion api's end

function validateProductoptions(user) {
    const schema = Joi.object({
        name: Joi.string().required(),
        subcategory_id: Joi.number().required(),
        price: Joi.string().required(),
        active: Joi.number()
    })
    return schema.validate(user);
}


//validation function ends

module.exports = router;