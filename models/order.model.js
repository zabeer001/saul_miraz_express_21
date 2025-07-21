import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  type: {
    type: String,
    trim: true,
    default: null,
  },
  items: {
    type: Number,
    default: 1,
  },
  status: {
    type: String,
    trim: true,
    default: 'pending',
  },
  shipping_method: {
    type: String,
    trim: true,
    default: null,
  },
  shipping_price: {
    type: Number,
    required: true,
    set: (value) => parseFloat(value.toFixed(2)),
  },
  order_summary: {
    type: String,
    default: null,
  },
  payment_method: {
    type: String,
    trim: true,
    default: null,
  },
  payment_status: {
    type: String,
    trim: true,
    default: 'unpaid',
  },
  promocode_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PromoCode',
    default: null,
  },
  promocode_name: {
    type: String,
    trim: true,
    default: null,
  },
  shipping_details: {
    type: mongoose.Schema.Types.Mixed,  // Accepts any type (JSON object)
    default: {}
  },
  total: {
    type: Number,
    required: true,
    set: (value) => parseFloat(value.toFixed(2)),
  },
}, {
  timestamps: true,
});

orderSchema.plugin(mongoosePaginate);

const Order = mongoose.model('Order', orderSchema);

export default Order;
