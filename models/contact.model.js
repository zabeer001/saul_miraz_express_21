import mongoose from 'mongoose';
import  mongoosePaginate  from 'mongoose-paginate-v2';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  how_can_we_help: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,  // equivalent to Laravel's $table->timestamps()
});

contactSchema.plugin(mongoosePaginate);

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
