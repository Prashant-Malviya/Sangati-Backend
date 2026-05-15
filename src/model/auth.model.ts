import {Schema, model} from 'mongoose'

const authSchema = new Schema({

    fullname : {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    }

}, {timestamps: true});

const AuthModel = model("Auth", authSchema)

export default AuthModel