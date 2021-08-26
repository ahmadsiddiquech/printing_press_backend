//libraries
const express = require('express');
const pool = require('../config/db.js');
const Joi = require('joi');

const router = express.Router();
const upload_url = "E:/Angular/printingshop/uploads/images/";
const front_server_url = "http://localhost:4200/";

//libraries end

// users registrtion api's start

router.get('/', async (req, res) => {
    try {
        const users = await pool.query(`SELECT products.*,categories.category,subcategories.name as subcategory FROM "products" 
         LEFT JOIN "subcategories" ON products.subcategory_id=subcategories.id 
         LEFT JOIN "categories" ON subcategories.category_id=categories.id 
         ORDER BY products.id asc`);
        if (users.rowCount >= 1) {
            users.rows.forEach(element => {
                element.image = (element.image == null || element.image == '') ? `${front_server_url}assets/images/placeholder.png` : `${front_server_url}uploads/images/${element.image}`;
            });
            // users.rows[0].image = (users.rows[0].image == null) ? `${front_server_url}assets/images/user_image.png` : `${front_server_url}uploads/images/${users.rows[0].image}`;
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
        const users = await pool.query(`SELECT products.*,categories.category,subcategories.name as subcategory FROM "products"
         LEFT JOIN "subcategories" ON products.subcategory_id=subcategories.id 
         LEFT JOIN "categories" ON subcategories.category_id=categories.id 
         WHERE products.id = $1`, [id]);
        if (users.rowCount >= 1) {
            users.rows[0].image = (users.rows[0].image == null || users.rows[0].image == '') ? `${front_server_url}assets/images/placeholder.png` : `${front_server_url}uploads/images/${users.rows[0].image}`;
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

router.post('/', async (req, res) => {
    try {
        const user = req.body;

        const result = validateProduct(user);

        if (result.error) {
            res.status(400).json(result.error.details[0].message);
            return;
        }
        const users = await pool.query('INSERT INTO "products" (category_id,subcategory_id,name,description,active) VALUES ($1,$2,$3,$4,$5) returning *', [user.category_id, user.subcategory_id, user.name, user.description, user.active]);
        // if(users.rowCount >= 1){
        //     user.finishingoptions_id.forEach(element => {
        //         const f_result = pool.query('INSERT INTO "product_finishingoption" (product_id,finishingoptions_id) VALUES ($1,$2)',[users.rows[0].id,element]);
        //     });
        // }
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

        // var cols = [];
        // for (const [key, value] of Object.entries(user)) {
        //     cols.push(key + " = '" + value + "'");
        // }
        const update = await pool.query("UPDATE products SET " + cols.join(', ') + " WHERE id = $1 returning *", [id]);
        // const update = await pool.query('UPDATE products SET category_id = $1, subcategory_id = $2, name = $3, price = $4, description = $5, active = $6 WHERE id = $7 returning *',[user.category_id,user.subcategory_id,user.name,user.price,user.description,user.active,id]);
        if (update.rowCount >= 1) {
            // const update = await pool.query('DELETE FROM product_finishingoption WHERE product_id = $1',[id]);
            // user.finishingoptions_id.forEach(element => {
            //     const f_result = pool.query('INSERT INTO "product_finishingoption" (product_id,finishingoptions_id) VALUES ($1,$2)',[id,element]);
            // });

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

router.put('/upload_image/:id', async (req, res) => {
    try {
        const id = req.params.id;

        let sampleFile;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: "Record Not Updated",
                data: ""
            });
        }

        sampleFile = req.files.image;
        uploadPath = upload_url + sampleFile.name;

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function (err) {
            if (err) {
                return res.status(500).send(err);
            }
        });

        const update = await pool.query("UPDATE products SET image = $1 WHERE id = $2", [sampleFile.name, id]);
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
        const users = await pool.query('DELETE FROM "products" WHERE id = $1', [id]);
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

router.get('/product_finishing_size/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const f_options = await pool.query(`SELECT finishing_size FROM "product_options" WHERE p_id = $1 GROUP BY finishing_size`, [id]);
        if (f_options.rowCount >= 1) {
            res.json({
                success: true,
                message: "",
                data: f_options.rows
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

router.post('/product_printed_pages/', async (req, res) => {
    try {
        const id = req.body.id;
        const f_size = req.body.f_size;
        const f_options = await pool.query(`SELECT printed_pages FROM "product_options" WHERE p_id = $1 and finishing_size = $2 GROUP BY printed_pages`, [id, f_size]);
        if (f_options.rowCount >= 1) {
            res.json({
                success: true,
                message: "",
                data: f_options.rows
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

router.post('/product_stocks/', async (req, res) => {
    try {
        const id = req.body.id;
        const f_size = req.body.f_size;
        const p_page = req.body.p_page;
        const f_options = await pool.query(`SELECT stock FROM "product_options" WHERE p_id = $1 and finishing_size = $2 and printed_pages = $3 GROUP BY stock`, [id, f_size, p_page]);
        if (f_options.rowCount >= 1) {
            res.json({
                success: true,
                message: "",
                data: f_options.rows
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

router.post('/product_covers/', async (req, res) => {
    try {
        const id = req.body.id;
        const f_size = req.body.f_size;
        const p_page = req.body.p_page;
        const p_stock = req.body.p_stock;
        const f_options = await pool.query(`SELECT cover FROM "product_options" WHERE p_id = $1 and finishing_size = $2 and printed_pages = $3 and stock = $4 GROUP BY cover`, [id, f_size, p_page, p_stock]);
        if (f_options.rowCount >= 1) {
            res.json({
                success: true,
                message: "",
                data: f_options.rows
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

router.post('/product_laminations/', async (req, res) => {
    try {
        const id = req.body.id;
        const f_size = req.body.f_size;
        const p_page = req.body.p_page;
        const p_stock = req.body.p_stock;
        const p_cover = req.body.p_cover;
        const f_options = await pool.query(`SELECT lamination FROM "product_options" WHERE p_id = $1 and finishing_size = $2 and printed_pages = $3 and stock = $4 and cover = $5 GROUP BY lamination`, [id, f_size, p_page, p_stock, p_cover]);
        if (f_options.rowCount >= 1) {
            res.json({
                success: true,
                message: "",
                data: f_options.rows
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

router.post('/product_quantities/', async (req, res) => {
    try {
        let f_options;
        const id = req.body.id;
        const f_size = req.body.f_size;
        const p_page = req.body.p_page;
        const p_stock = req.body.p_stock;
        const p_cover = req.body.p_cover;
        const p_lamination = req.body.p_lamination;
        const p_turnaround = req.body.p_turnaround;
        if (p_turnaround == "one_day") {
            f_options = await pool.query(`SELECT one_day as price,quantity FROM "product_options" WHERE p_id = $1 and finishing_size = $2 and printed_pages = $3 and stock = $4 and cover = $5 and lamination = $6 order by one_day asc`, [id, f_size, p_page, p_stock, p_cover, p_lamination]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        } else if (p_turnaround == "two_day") {
            f_options = await pool.query(`SELECT two_day as price,quantity FROM "product_options" WHERE p_id = $1 and finishing_size = $2 and printed_pages = $3 and stock = $4 and cover = $5 and lamination = $6 order by two_day asc`, [id, f_size, p_page, p_stock, p_cover, p_lamination]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        } else if (p_turnaround == "three_day") {
            f_options = await pool.query(`SELECT three_day as price,quantity FROM "product_options" WHERE p_id = $1 and finishing_size = $2 and printed_pages = $3 and stock = $4 and cover = $5 and lamination = $6 order by three_day asc`, [id, f_size, p_page, p_stock, p_cover, p_lamination]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        } else if (p_turnaround == "seven_day") {
            f_options = await pool.query(`SELECT seven_day as price,quantity FROM "product_options" WHERE p_id = $1 and finishing_size = $2 and printed_pages = $3 and stock = $4 and cover = $5 and lamination = $6 order by seven_day asc`, [id, f_size, p_page, p_stock, p_cover, p_lamination]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        }


    } catch (error) {
        res.json(error.message);
    }
});

router.post('/product_prices/', async (req, res) => {
    try {

        const id = req.body.id;
        const f_size = req.body.f_size;
        const p_page = req.body.p_page;
        const p_stock = req.body.p_stock;
        const p_cover = req.body.p_cover;
        const p_lamination = req.body.p_lamination;
        const p_turnaround = req.body.p_turnaround;
        const p_quantity = req.body.p_quantity;
        if (p_turnaround == "one_day") {
            const f_options = await pool.query(`SELECT one_day as price,vat,product_id FROM "product_options" WHERE p_id = $1 and finishing_size = $2 and printed_pages = $3 and stock = $4 and cover = $5 and lamination = $6 and quantity = $7`, [id, f_size, p_page, p_stock, p_cover, p_lamination, p_quantity]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        } else if (p_turnaround == "two_day") {
            const f_options = await pool.query(`SELECT two_day as price,vat,product_id FROM "product_options" WHERE p_id = $1 and finishing_size = $2 and printed_pages = $3 and stock = $4 and cover = $5 and lamination = $6 and quantity = $7`, [id, f_size, p_page, p_stock, p_cover, p_lamination, p_quantity]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        } else if (p_turnaround == "three_day") {
            const f_options = await pool.query(`SELECT three_day as price,vat,product_id FROM "product_options" WHERE p_id = $1 and finishing_size = $2 and printed_pages = $3 and stock = $4 and cover = $5 and lamination = $6 and quantity = $7`, [id, f_size, p_page, p_stock, p_cover, p_lamination, p_quantity]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        } else if (p_turnaround == "seven_day") {
            const f_options = await pool.query(`SELECT seven_day as price,vat,product_id FROM "product_options" WHERE p_id = $1 and finishing_size = $2 and printed_pages = $3 and stock = $4 and cover = $5 and lamination = $6 and quantity = $7`, [id, f_size, p_page, p_stock, p_cover, p_lamination, p_quantity]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        }


    } catch (error) {
        res.json(error.message);
    }
});

router.post('/product_by_product_id/', async (req, res) => {
    try {
        const p_turnaround = req.body.p_turnaround;
        const product_id = req.body.product_id;
        if (p_turnaround == "one_day") {
            const f_options = await pool.query(`SELECT one_day as price,* FROM "product_options" WHERE product_id = $1`, [product_id]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        } else if (p_turnaround == "two_day") {
            const f_options = await pool.query(`SELECT two_day as price* FROM "product_options" WHERE product_id = $1`, [product_id]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        } else if (p_turnaround == "three_day") {
            const f_options = await pool.query(`SELECT three_day as price,* FROM "product_options" WHERE product_id = $1`, [product_id]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        } else if (p_turnaround == "seven_day") {
            const f_options = await pool.query(`SELECT seven_day as price,* FROM "product_options" WHERE product_id = $1`, [product_id]);
            if (f_options.rowCount >= 1) {
                res.json({
                    success: true,
                    message: "",
                    data: f_options.rows
                });
            } else {
                res.json({
                    success: false,
                    message: "Record Not Found",
                    data: ""
                });
            }
        }
    } catch (error) {
        res.json(error.message);
    }
});

// users registrtion api's end

function validateProduct(user) {
    const schema = Joi.object({
        name: Joi.string().required(),
        // price: Joi.string().required(),
        image: Joi.string().required(),
        category_id: Joi.number().required(),
        subcategory_id: Joi.number().required(),
        // finishingoptions_id: Joi.array().required(),
        description: Joi.string().required(),
        active: Joi.number()
    })
    return schema.validate(user);
}


//validation function ends

module.exports = router;