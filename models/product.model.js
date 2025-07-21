import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null, // single main image (optional)
    },
    media: {
        type: [
            {
                file_path: { type: String, required: true },
                alt: { type: String, default: '' },
                order: { type: Number, default: 0 },
            }
        ],
        default: [],
    },
    price: {
        type: Number,
        required: true,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    status: {
        type: String,
        required: true,
    },
    arrival_status: {
        type: String,
        default: 'regular',
    },
    cost_price: {
        type: Number,
        required: true,
    },
    stock_quantity: {
        type: Number,
        default: 1,
    },
    arrival_status: {
        type: String,
        default: 'regular',
    },
    sales: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// Apply pagination plugin
productSchema.plugin(mongoosePaginate);

const Product = mongoose.model('Product', productSchema);
export default Product;
