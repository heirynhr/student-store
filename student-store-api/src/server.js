const express = require('express');
// const morgan=require("morgan");
const app = express();
;
app.use(express.json());
app.use("/products", productsRouter);
// app.use(morgan("dev"));


const PORT =3000;
const productsRouter = require("../routes/productRoutes");





app.get('/', (req, res) => {
    res.send('Welcome to my Student Store!');
})




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})