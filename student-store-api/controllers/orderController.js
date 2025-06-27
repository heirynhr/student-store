
const prisma = require("../src/db/db");


//GET - THE ENTIRE ORDER LIST RUN DOWN  -> /order
exports.getAll = async (req, res) => {
    const {category, sort} = req.query
    const filters = {}
    if (category) {
        filters.category =  {
            equals: category,
            mode : "insensitive",
        };
    }
    let orderFilter;
    if (sort === "price" || sort === "name"){
        orderFilter= {
            [sort]: "asc",
        };
    }
    const orderList = await prisma.order.findMany({
        where: filters,
        orderBy: orderFilter,
        include: {
            orderItems: true,
        }
    });
    res.json(orderList);
};


//GET by order ID
exports.getById = async (req, res) => {
        //get id as number from the params
    const id = Number(req.params.id); 
    const order = await prisma.order.findUnique({ 
        where: { id }, 
        include: {
            orderItems: true,
        }
    });
    if (!order) return res.status(404).json({ error: "Order not found!" });
    res.json(order);
};

// POST create a ORDER listing
exports.create = async (req, res) => {
    const { customer, total, status, orderItems} = req.body;
    const newOrder = await prisma.order.create({
        data: { customer, total, status,
            orderItems: {
                create: orderItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        },
        include: {
            orderItems: true,
        }
    });
    res.status(201).json(newOrder);
};

//PUT update a specific ORDER need to put its id 
exports.update = async (req, res) => {
    const id = Number(req.params.id);
    const { customer, total, status,orderItems} = req.body;

    //update the new order
    const updatedOrder = await prisma.order.update({
        where: { id },
        data: { customer, total, status,
            orderItems: {
                create: orderItems.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    price: item.price
                }))
            }
        },
        include: {
            orderItems: true,
        }
    });
    res.json(updatedOrder);
};

//DELETE a specific ORDER
exports.remove = async (req, res) => {
    const id = Number(req.params.id);
    await prisma.order.delete({ where: { id } });
    res.status(204).end();
};




//CUSTOM ENDPOINTS FOR ORDER ITEMS

// /orders/:orderId/items
// this creates/adds items to an existing order
exports.createOrderItems = async (req, res) => {
    const orderId = Number(req.params.id);
    //check if order exists
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
        return res.status(404).json({ error: "Order not found." });
    }

    const { productId,quantity,price} = req.body;
    const newOrderItem = await prisma.orderItem.create({
        data: { orderId, productId,quantity,price },
    });
    res.status(201).json(newOrderItem);
};

exports.getOrderTotal  = async (req, res) => { 
    const orderId = Number(req.params.id);
    //check if order exists
    const order = await prisma.order.findUnique({ 
        where: { id: orderId },
        include: { orderItems: true }
    });
    if (!order) {
        return res.status(404).json({ error: "Order not found." });
    }
    const orderItemsArray = order.orderItems

    let arrayTotal =0;
    orderItemsArray.forEach(item => {
        arrayTotal += (item.price * item.quantity);
    });
    await prisma.order.update({
        where: { id: orderId },
        data: { totalPrice: arrayTotal },
    });

    //for everyitem in order tiems
    //      get the item.price * item.quantity and +=total
    // need to return the total of the new order or whatever
    res.status(201).json({ total: arrayTotal });
}