

const prisma = require("../src/db/db");



//GET - THE ENTIRE PRODUCT LIST RUN DOWN  -> /products
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
    const productList = await prisma.product.findMany({
        where: filters,
        orderBy: orderFilter,
    });
    res.json(productList);
};


//GET by product ID
exports.getById = async (req, res) => {
        //get id as number from the params
    const id = Number(req.params.id); 
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ error: "Product not found!" });
    res.json(product);
};

// POST create a product listing
exports.create = async (req, res) => {
    const { name, description, price, image_url, category } = req.body;
    const newProduct = await prisma.product.create({
        data: { name, description, price, image_url, category },
    });
    res.status(201).json(newProduct);
};


// {
//     "name": "necklace",
//     "description": "shiny neck thing",
//     "price": 5.5,
//     "category": "beauty"
// }

//PUT update a specific listing need to put its id 
exports.update = async (req, res) => {
    const id = Number(req.params.id);
    const { name, description, price, image_url, category} = req.body;
    const updatedProduct = await prisma.product.update({
        where: { id },
        data: { name, description, price, image_url, category},
    });
    res.json(updatedProduct);
};

//DELETE a specific product
exports.remove = async (req, res) => {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.status(204).end();
};


