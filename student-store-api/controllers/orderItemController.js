
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
    const orderItemList = await prisma.orderItem.findMany({
        where: filters,
        orderBy: orderFilter,
    });
    res.json(orderItemList);
};


//GET by order ID
exports.getById = async (req, res) => {
        //get id as number from the params
    const id = Number(req.params.id); 
    const orderItem = await prisma.orderItem.findUnique({ where: { id } });
    if (!orderItem) return res.status(404).json({ error: "Order Item not found!" });
    res.json(orderItem);
};

// POST create a ORDER listing
exports.create = async (req, res) => {
    const { orderId, productId,quantity,price} = req.body;
    const newOrderItem = await prisma.orderItem.create({
        data: { orderId, productId,quantity,price },
    });
    res.status(201).json(newOrderItem);
};

//PUT update a specific ORDER need to put its id 
exports.update = async (req, res) => {
    const id = Number(req.params.id);
    const { orderId, productId,quantity,price} = req.body;
    const updatedOrderItem = await prisma.orderItem.update({
        where: { id },
        data: { orderId, productId,quantity,price},
    });
    res.json(updatedOrderItem);
};

//DELETE a specific ORDER
exports.remove = async (req, res) => {
    const id = Number(req.params.id);
    await prisma.orderItem.delete({ where: { id } });
    res.status(204).end();
};
