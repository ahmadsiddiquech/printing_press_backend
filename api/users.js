//libraries
const express = require('express');
const pool = require('../config/db.js');

const { sign } = require('jsonwebtoken');
const { genSaltSync,hashSync,compareSync } = require('bcrypt');
const Joi = require('joi');
const router = express.Router();
const upload_url = "E:/Angular/printingshop/uploads/images/";
const front_server_url = "http://localhost:4200/";

//libraries end

const salt = genSaltSync(10);

// users registrtion api's start

router.get('/', async(req,res) => {
    try {
        const users = await pool.query('SELECT * FROM "users" ORDER BY id asc');
        if(users.rowCount >= 1){
            users.rows[0].image = (users.rows[0].image != null) ? `${front_server_url}assets/images/user_image.png` : `${front_server_url}uploads/images/${users.rows[0].image}`;
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
        const users = await pool.query('SELECT id,first_name,last_name,email,role,active,image FROM "users" WHERE id = $1',[id]);
        if(users.rowCount >= 1){
            users.rows[0].image = (users.rows[0].image != null) ? `${front_server_url}assets/images/user_image.png` : `${front_server_url}uploads/images/${users.rows[0].image}`;
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
        const result = validateUser(user);
        
        if(result.error){
            res.status(400).json(result.error.details[0].message);
            return;
        }
        user.password = hashSync(user.password,salt);
        const users = await pool.query('INSERT INTO "users" (first_name,last_name,email,password,role) VALUES ($1,$2,$3,$4,$5) returning *',[user.first_name,user.last_name,user.email,user.password,user.role]);
        if(users.rowCount >= 1){
            delete users.rows[0]["password"];
            res.json({
                success:true,
                message:"Registration Succesfull",
                data:users.rows[0]
            });
        }else{
            res.json({
                success:false,
                message:"Registration Failed",
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
        const update = await pool.query("UPDATE users SET " + cols.join(', ') + " WHERE id = $1 returning *",[id]);
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
        const update = await pool.query("UPDATE users SET image = $1 WHERE id = $2 returning *",[sampleFile.name,id]);
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

router.delete('/:id', async(req,res) => {
    try {
        const id = req.params.id;
        const del = await pool.query('DELETE FROM "users" WHERE id = $1',[id]);
        res.json({
            success:true,
            message:"User Deleted Succesfully",
            data:""
        });
    } catch (error) {
        res.json(error.message);
    }
});

// users registrtion api's end

// user login api's start

router.post('/login', async(req,res) => {
    try {
        const login = req.body;
        const validation = validateLogin(login);
        
        if(validation.error){
            res.status(400).json(validation.error.details[0].message);
            return;
        }

        
        const data = await pool.query('SELECT * FROM "users" WHERE email = $1',[login.email]);
        if(data.rowCount >= 1){
            const result = compareSync(login.password,data.rows[0].password);
            if(result){
                data.rows[0].re
                delete data.rows[0]["password"];
                const jsontoken = sign({ result:result }, "hsah" ,{
                    expiresIn : "1h"
                });
                res.json({
                    success:true,
                    message:"Login Succesfull",
                    token:jsontoken,
                    data:data.rows[0]
                });
            }else{
                res.json({
                    success:false,
                    message:"Invalid email or password",
                    token:"",
                    data:""
                });
            }
        }else{
            res.json({
                success:false,
                message:"Invalid email or password",
                token:"",
                data:""
            });
        }
        
    } catch (error) {
        res.json(error.message);
    }
});

// user login api's end




// validation functions start

function validateUser(user) {
    const schema =  Joi.object({
        first_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.required()
    })

    return schema.validate(user);
}


function validateLogin(user) {
    const schema =  Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    })

    return schema.validate(user);
}
//validation function ends

module.exports = router;