const express = require('express');
const cors = require("cors");
const fileUpload = require('express-fileupload');


const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());


const usersRoutes = require('./api/users.js');
const adminRoutes = require('./api/admin.js');
const categoriesRoutes = require('./api/categories.js');


app.use('/api/users',usersRoutes);
app.use('/api/admin',adminRoutes);
app.use('/api/categories',categoriesRoutes);


const port = process.env.port || 3000;
app.listen(port, () => console.log(`Server Running at http://localhost:${port}`));