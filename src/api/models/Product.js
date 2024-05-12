const mongoose = require('mongoose')
const nameRegex = /^[a-zA-Z\s]+$/
const ProductModel = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        match: [nameRegex, 'Name can only contain letters and spaces.'],
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator: (value) => {
                // Assuming a basic validation for image URL
                const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w .-]*)*\/?$/;
                return urlRegex.test(value);
            },
            message: 'Invalid image URL.',
        },
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
})

module.exports = mongoose.model('Product',ProductModel)