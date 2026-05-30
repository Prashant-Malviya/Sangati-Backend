import {Schema, model} from 'mongoose'
import bcrypt from 'bcrypt'
// import {v4 as uuid} from 'uuid'
// import moment from 'moment';

const authSchema = new Schema({

    image: {
        type: String,
        default: null,
    },
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
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
    },
    refreshToken: {
        type: String,
    },
    expiry: {
        type: Date
    }

}, {timestamps: true});

authSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    this.password = await bcrypt.hash(this.password.toString(), 12)
})

authSchema.pre('save', function(){
    // following we use when we signup user and directly send to dashboard in modern website this approach is followed
    // this.refreshToken = uuid()
    // this.expiry = moment().add(7, "days").toDate() 
    
    this.refreshToken = null
    this.expiry = null;
})

const AuthModel = model("Auth", authSchema)

export default AuthModel