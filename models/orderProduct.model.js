import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const orderProductSchema = new mongoose.Schema({
  order_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
}, {
  timestamps: true,
});

orderProductSchema.plugin(mongoosePaginate);

const OrderProduct = mongoose.model('OrderProduct', orderProductSchema);

export default OrderProduct;
