//libraries
const express = require('express');
const pool = require('../config/db.js');
const Joi = require('joi');

const router = express.Router();
const upload_url = "E:/Angular/printingshop/uploads/images/";
const front_server_url = "http://localhost:4200/";

//libraries end

// users registrtion api's start

router.get('/', async(req,res) => {
    try {
        const users = await pool.query('SELECT * FROM "subcategories" ORDER BY id asc');
        if(users.rowCount >= 1){
            users.rows.forEach(element => {
                element.image = (element.image == null || element.image == '') ? `${front_server_url}assets/images/placeholder.png` : `${front_server_url}uploads/images/${element.image}`;
            });
            // users.rows[0].image = (users.rows[0].image == null) ? `${front_server_url}assets/images/user_image.png` : `${front_server_url}uploads/images/${users.rows[0].image}`;
            res.json({
                success:true,
                message:"",
                data:users.rows
            });
        }else{
            res.json({
                success:false,
                message:"Record Not Found",
                data:""
            });
        }
    } catch (error) {
        res.json(error.message);
    }
});

router.get('/:id', async(req,res) => {
    try {
        const id = req.params.id;
        const users = await pool.query('SELECT id,name,description,image,active FROM "subcategories" WHERE id = $1',[id]);
        if(users.rowCount >= 1){
            users.rows[0].image = (users.rows[0].image == null || element.image == '') ? `${front_server_url}assets/images/placeholder.png` : `${front_server_url}uploads/images/${users.rows[0].image}`;
            res.json({
                success:true,
                message:"",
                data:users.rows[0]
            });
        }else{
            res.json({
                success:false,
                message:"Record Not Found",
                data:""
            });
        }
    } catch (error) {
        res.json(error.message);
    }
});

router.post('/', async(req,res) => {
    try {
        const user = req.body;
        const result = validateSubcategory(user);
        
        if(result.error){
            res.status(400).json(result.error.details[0].message);
            return;
        }
        const users = await pool.query('INSERT INTO "subcategories" (category,description) VALUES ($1,$2) returning *',[user.category,user.description]);
        if(users.rowCount >= 1){
            res.json({
                success:true,
                message:" Succesfull",
                data:users.rows[0]
            });
        }else{
            res.json({
                success:false,
                message:" Failed",
                data:""
            });
        }
    } catch (error) {
        res.json(error.message);
    }
});

router.put('/:id', async(req,res) => {
    try {
        const id = req.params.id;
        var user = req.body;

        var cols = [];
        for (const [key, value] of Object.entries(user)) {
            cols.push(key + " = '" + value + "'");
        }
        const update = await pool.query("UPDATE subcategories SET " + cols.join(', ') + " WHERE id = $1 returning *",[id]);
        if(update.rowCount >= 1){
            delete update.rows[0]["password"];
            res.json({
                success:true,
                message:"Record Updated Succesfully",
                data:update.rows[0]
            });
        }else{
            res.json({
                success:false,
                message:"Update Failed",
                data:""
            });
        }
    } catch (error) {
        res.json(error.message);
    }
});

router.put('/upload_image/:id', async(req,res) => {
    try {
        const id = req.params.id;

        let sampleFile;
        let uploadPath;

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success:false,
                message:"Record Not Updated",
                data:""
            });
        }

        sampleFile = req.files.image;
        uploadPath = upload_url + sampleFile.name;

        // Use the mv() method to place the file somewhere on your server
        sampleFile.mv(uploadPath, function(err) {
            if (err){
                return res.status(500).send(err);
            }
        });
        const update = await pool.query("UPDATE subcategories SET image = $1 WHERE id = $2 returning *",[sampleFile.name,id]);
        if(update.rowCount >= 1){
            res.json({
                success:true,
                message:"Record Updated Succesfully",
                data:update.rows[0]
            });
        }else{
            res.json({
                success:false,
                message:"Update Failed",
                data:""
            });
        }
    } catch (error) {
        res.json(error.message);
    }
});

router.delete('/:id', async(req,res) => {
    try {
        const id = req.params.id;
        const users = await pool.query('DELETE FROM "subcategories" WHERE id = $1',[id]);
        if(users.rowCount > 0){
            res.json({
                success:true,
                message:" Deleted Succesfully",
                data:""
            });
        }else{
            res.json({
                success:false,
                message:"Not Deleted",
                data:""
            });
        }
        
    } catch (error) {
        res.json(error.message);
    }
});

// users registrtion api's end

function validateSubcategory(user) {
    const schema =  Joi.object({
        subcategory: Joi.string().required(),
        description: Joi.string().required()
    })
    return schema.validate(user);
}


//validation function ends

module.exports = router;