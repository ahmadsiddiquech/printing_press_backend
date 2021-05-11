//libraries

const express = require('express');
const pool = require('./config/db');
const Joi = require('joi');
const app = express();
const cors = require("cors");
const { sign } = require('jsonwebtoken');
const { genSaltSync,hashSync,compareSync } = require('bcrypt');

//libraries end


// app main function starts

app.use(cors()); 
app.use(express.json());

// app main function end

// users registrtion api's start

app.get('/api/users', async(req,res) => {
    try {
        const users = await pool.query('SELECT id,first_name,last_name,email,role,active,password FROM "users" ORDER BY id asc');
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

app.get('/api/users/:id', async(req,res) => {
    try {
        const id = req.params.id;
        const users = await pool.query('SELECT id,first_name,last_name,email,role,active FROM "users" WHERE id = $1',[id]);
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

app.post('/api/users', async(req,res) => {
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

app.put('/api/users/:id', async(req,res) => {
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

app.delete('/api/users/:id', async(req,res) => {
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

app.post('/api/login', async(req,res) => {
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

// server start
const salt = genSaltSync(10);
const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listning on port ${port}..`));