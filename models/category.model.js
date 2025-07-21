import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
    type: {
        type: String,
        trim: true,
    },
    image: {
        type: String, // URL or file path to the image
        trim: true,
    },
}, {
    timestamps: true,
});

// Apply pagination plugin
categorySchema.plugin(mongoosePaginate);

const Category = mongoose.model('Category', categorySchema);

export default Category;
