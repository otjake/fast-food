const {body, validationResult} = require("express-validator");
const CartItem = require("../models/Cart");
const Product = require("../models/Product");
const {CustomError} = require("../middleware/customErrorHandler");

const addItemsToCart = async (req, res, next) => {
    try {
        const {qty, product_id } = req.body;
        console.log(req.body);
        const cartProduct = await Product.findById(product_id);

        if (!cartProduct) {
            next(new CustomError('Product not found', 404));
            return;
        }

        const data = {
            'quantity' : qty,
            'product' : product_id,
            'price' : cartProduct.price * qty,
            'user' : req.user.userId
        };
        const product = await CartItem.create(data);
        res.status(200).json(product);
    } catch (error) {
        next(error);
    }
}

const getCartItems = async (req, res, next) => {
    try {
        const cartItems = await CartItem.findOne({ user: req.user.userId });
        res.status(200).json(cartItems);
    } catch (error) {
        next(error);
    }
}

const getCartItem = async (req, res, next) => {
    try {
        const cartItem = await CartItem.findById(req.params.id);
        if (!cartItem) {
            next(new CustomError('Cart item not found', 404));
            return;
        }
        res.status(200).json(cartItem);
    } catch (error) {
        next(error);
    }
}

const fetchSearchParams = (req) => {
    let searchParameters = {
        _id: req.params.id,
        user: req.user.userId
    }
    return searchParameters;
}

const updateCartItem = async (req, res, next) => {
    try {
        let searchParameters = fetchSearchParams(req);
        const cartItem = await CartItem.findOne(searchParameters).populate('product');

        if (!cartItem) {
            next(new CustomError('Item not found', 404));
            return;
        }
        console.log(cartItem.product)
        //update the cart item
        cartItem.quantity = req.body.qty;
        cartItem.price = cartItem.product.price * req.body.qty;
        await cartItem.save();
        res.status(200).json(cartItem);
    } catch (error) {
        next(error);
    }
}

const deleteItemFromCart = async (req, res, next) => {
    try {
        let searchParameters = fetchSearchParams(req);
        await CartItem.deleteOne(searchParameters);
        res.status(204).json();
    } catch (error) {
        next(error);
    }
}



const validate = (operation) => {
    switch (operation) {
        case 'createUpdateCart':
            return [
                body('product_id').notEmpty().isString().withMessage('Product Must be selected.'),
                body('qty').notEmpty().isNumeric().withMessage('qty must be a numeric value.'),
            ];
    }
}

module.exports = {
    validate,
    deleteItemFromCart,
    updateCartItem,
    getCartItems,
    getCartItem,
    addItemsToCart,
};
