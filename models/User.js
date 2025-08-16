import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: { 
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        select: false,
        minlength: 6
    },
},
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);

export default User;