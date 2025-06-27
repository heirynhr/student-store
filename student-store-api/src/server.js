const express = require('express');
// const morgan=require("morgan");
const cors = require("cors");
const app = express();

app.use(express.json());

// app.use(morgan("dev"));
app.use(cors());




const PORT =3000;
const productsRouter = require("../routes/productRoutes");
app.use("/products", productsRouter);

const ordersRouter = require("../routes/orderRoutes");
app.use("/orders", ordersRouter);

const orderItemRouter = require("../routes/orderItemRoutes");
app.use("/orders/orderItem", orderItemRouter);



app.get('/', (req, res) => {
    res.send('Welcome to my Student Store!');
})




app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`)
})