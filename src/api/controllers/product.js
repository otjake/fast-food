const {body, validationResult} = require("express-validator");
const Product = require("../models/Product");
const cloudinary = require("../services/cloudinarySetup")
const fs = require('fs');
const Category = require("../models/Category");

const getProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate('category').exec();
        //filter by category
        res.status(200).json(products);
    } catch (error) {
        next(error)
    }
}
const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('category').exec();
        res.status(200).json(product);
    } catch (error) {
        next(error)
    }
}

const getProductsByCategory = async (req, res, next) => {
    try {
        const products = await Product.find({category: req.params.category_id}).populate('category').exec();
        res.status(200).json(products);
    } catch (error) {
        next(error)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!product) {
            return res.status(404).json({error: 'Category not found'});
        }
        res.status(200).json(product);
    } catch (e) {
        next(e)
    }
}

const createProduct = async (req,res,next) => {
    try {
        let imagePath = req.file.path
        const imageResult = await cloudinary.uploader.upload(imagePath, {
            use_filename: true,
            unique_filename: false,
        });

        let body = {
            'image' : imageResult.secure_url,
            'name' : req.body.name,
            'price' : req.body.price,
            'category' : req.body.category_id
        }
        const product = await Product.create(body);
        res.status(200).json(product);
    } catch (error) {
        next(error)
    } finally {
        // Delete the temporary file
        fs.unlinkSync(req.file.path);
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        next(error)
    }
}

const validate = (operation) => {
    switch (operation) {
        case 'createUpdateProduct':
            return [
                body('name').notEmpty().isString().withMessage('Name is required.'),
                body('price').notEmpty().isNumeric().withMessage('Price must be a numeric value.'),
                body('category_id').notEmpty().isNumeric().withMessage('Category must be a numeric value.'),
                body('image').notEmpty().withMessage('Image is required.')
            ];
    }
}

module .exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    validate,
    deleteProduct
}

