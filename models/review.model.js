import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const reviewSchema = new mongoose.Schema({
    product_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
}, {
    timestamps: true,
    toObject: { virtuals: true }, // 👈 Enable virtuals for JSON & object outputs
    toJSON: { virtuals: true },
});

// ✅ Add virtual for `user`
reviewSchema.virtual('user', {
    ref: 'User',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

// ✅ Add virtual for `product`
reviewSchema.virtual('product', {
    ref: 'Product',
    localField: 'product_id',
    foreignField: '_id',
    justOne: true
});

// ✅ Pagination plugin
reviewSchema.plugin(mongoosePaginate);

// ✅ Model
const Review = mongoose.model('Review', reviewSchema);

export default Review;
