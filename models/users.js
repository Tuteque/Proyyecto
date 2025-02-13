const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema({
    nombre:{
        type: String,
        required: true
    },
    apellido:{
        type: String,
        required: true
    },
    edad:{
        type: Number,
        required: true
    },
    nacionalidad:{
        type: String,
        required: true
    },
    sexo:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    fecha:{
        type: Date,
        required: true
    },
    imagePath:{
        type: String,
        required: true
    }
},{timestamps:true})

const User = mongoose.model('users', usersSchema)
module.exports = User;