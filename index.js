const express = require('express');
const cors = require("cors");


const app = express();
app.use(cors());
app.use(express.json());


const usersRoutes = require('./api/users.js');
const adminRoutes = require('./api/admin.js');


app.use('/api/users',usersRoutes);
app.use('/api/admin',adminRoutes);


const port = process.env.port || 3000;
app.listen(port, () => console.log(`Server Running at http://localhost:${port}`));