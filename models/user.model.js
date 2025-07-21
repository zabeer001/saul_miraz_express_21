import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleAuth;
        },
        minlength: 6, // optional: for basic validation
    },
    phone: {
        type: String,
        trim: true,
    },
    image: {
        type: String,
        trim: true,
    },
    full_address: {
        type: String,
        trim: true,
        default: null,
    },
    city: {
        type: String,
        trim: true,
        default: null,
    },
    state: {
        type: String,
        trim: true,
        default: null,
    },
    postal_code: {
        type: String,
        trim: true,
        default: null,
    },
    country: {
        type: String,
        trim: true,
        uppercase: true,
        default: null,
    },

    role: {
        type: String,
        required: true,
        default: 'user',
    }
}, {
    timestamps: true,
});

// Add pagination plugin
userSchema.plugin(mongoosePaginate);

const User = mongoose.model('User', userSchema);

export default User;
