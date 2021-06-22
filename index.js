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
const subcategoriesRoutes = require('./api/subcategories.js');
const finishingoptionsRoutes = require('./api/finishingoptions.js');
const additionaloptionsRoutes = require('./api/additionaloptions.js');
const unfoldedsizeRoutes = require('./api/unfoldedsize.js');
const foldingstyleRoutes = require('./api/foldingstyle.js');
const printedsidesRoutes = require('./api/printedsides.js');
const papertypeRoutes = require('./api/papertype.js');
const paperweightRoutes = require('./api/paperweight.js');
const productoptionsRoutes = require('./api/productoptions.js');

const productsRoutes = require('./api/products.js');


app.use('/api/users', usersRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/subcategories', subcategoriesRoutes);
app.use('/api/finishingoptions', finishingoptionsRoutes);
app.use('/api/additionaloptions', additionaloptionsRoutes);
app.use('/api/unfoldedsize', unfoldedsizeRoutes);
app.use('/api/foldingstyle', foldingstyleRoutes);
app.use('/api/printedsides', printedsidesRoutes);
app.use('/api/papertype', papertypeRoutes);
app.use('/api/paperweight', paperweightRoutes);
app.use('/api/productoptions', productoptionsRoutes);

app.use('/api/products', productsRoutes);


const port = process.env.port || 3000;
app.listen(port, () => console.log(`Server Running at http://localhost:${port}`));