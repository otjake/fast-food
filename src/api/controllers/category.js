const {body, validationResult} = require("express-validator");
const Category = require("../models/Category");
const {CustomError} = require("../middleware/customErrorHandler");

const createCategory = async (req, res, next) => {

    const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions

    if (!errors.isEmpty()) {
        res.status(422).json({errors: errors.array()});
        return;
    }

    const {name} = req.body;

    try{
        const newCategory = await Category.create({
            name: name
        })

        res.json(newCategory)
    } catch (e) {
        console.log("the e", e)
        next(e)
    }
}

const getCategories = async (req, res, next) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        next(error)
    }
}

const getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        next(error)
    }
}

const updateCategory = async (req, res, next) => {
    try {
            const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
            });

        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
        } catch (error) {
            next(error)
        }
}

const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        next(error)
    }
}

const validate = (operation) => {
    switch (operation) {
        case 'createCategory':
            return [
                body('name').isString().isLength({ min: 3, max: 50 }),
            ];
    }
}

module.exports = {
    validate,
    createCategory,
    getCategories,
    getCategory,
    updateCategory,
    deleteCategory,
};
