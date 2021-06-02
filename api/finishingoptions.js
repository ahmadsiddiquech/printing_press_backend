//libraries
const express = require('express');
const pool = require('../config/db.js');
const Joi = require('joi');

const router = express.Router();

//libraries end

// users registrtion api's start

router.get('/', async(req,res) => {
    try {
        const users = await pool.query('SELECT finishingoptions.*,categories.category,categories.id as category_id,subcategories.name as subcategory FROM "finishingoptions" LEFT JOIN "subcategories" ON finishingoptions.subcategory_id=subcategories.id LEFT JOIN "categories" ON subcategories.category_id=categories.id ORDER BY finishingoptions.id asc');
        if(users.rowCount >= 1){
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
        const users = await pool.query('SELECT finishingoptions.*,categories.category,categories.id as category_id,subcategories.name as subcategory FROM "finishingoptions" LEFT JOIN "subcategories" ON finishingoptions.subcategory_id=subcategories.id LEFT JOIN "categories" ON subcategories.category_id=categories.id WHERE finishingoptions.id = $1',[id]);
        if(users.rowCount >= 1){
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
        delete user.category_id;
        const result = validateFinishingoptions(user);
        
        if(result.error){
            res.status(400).json(result.error.details[0].message);
            return;
        }
        const users = await pool.query('INSERT INTO "finishingoptions" (subcategory_id,name,active) VALUES ($1,$2,$3) returning *',[user.subcategory_id,user.name,user.active]);
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
        delete user.category_id;

        var cols = [];
        for (const [key, value] of Object.entries(user)) {
            cols.push(key + " = '" + value + "'");
        }
        const update = await pool.query("UPDATE finishingoptions SET " + cols.join(', ') + " WHERE id = $1 returning *",[id]);
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
        const users = await pool.query('DELETE FROM "finishingoptions" WHERE id = $1',[id]);
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

function validateFinishingoptions(user) {
    const schema =  Joi.object({
        name: Joi.string().required(),
        subcategory_id: Joi.number().required(),
        active: Joi.number()
    })
    return schema.validate(user);
}


//validation function ends

module.exports = router;