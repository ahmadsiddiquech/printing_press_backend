const express = require('express');
const pool = require('./db');
const Joi = require('joi');
const app = express();
app.use(express.json()); // for parsing application/json


app.get('/api/users', async(req,res) => {
    try {
        const users = await pool.query('SELECT * FROM users ORDER BY id asc');
        res.json(users.rows);
    } catch (error) {
        res.json(error.message);
    }
});

app.get('/api/users/:id', async(req,res) => {
    try {
        const id = req.params.id;
        const users = await pool.query('SELECT FROM users WHERE id = $1',[id]);
        res.json(users.rows[0]);
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
        const users = await pool.query('INSERT INTO users (first_name,last_name,email,password,role) VALUES ($1,$2,$3,$4,$5) RETURNING *',[user.first_name,user.last_name,user.email,user.password,user.role]);
        res.json(users.rows[0]);
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
        const update = await pool.query("UPDATE users SET " + cols.join(', ') + " WHERE id = $1",[id]);
        res.json("Record Updated Succesfully");
    } catch (error) {
        res.json(error.message);
    }
});

app.delete('/api/users/:id', async(req,res) => {
    try {
        const id = req.params.id;
        const del = await pool.query('DELETE FROM users WHERE id = $1',[id]);
        res.json("User Deleted succesfully");
    } catch (error) {
        res.json(error.message);
    }
});


function validateUser(user) {
    const schema =  Joi.object({
        first_name: Joi.string().min(3).required(),
        last_name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().required()
    })

    return schema.validate(user);
}


const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listning on port ${port}..`));