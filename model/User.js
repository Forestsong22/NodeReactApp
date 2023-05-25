const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlenght: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
});



const User = mongoose.model('User', userSchema);

module.exports = { User }

/**
 * 
 * trim : 스페이스(빈공간)을 없애준다.
 * unique : 1 => 유니크한 유저
 * role: 관리자나 or 유저를 설정할 수 있다.
 * default: 0 설정도 가능하다.
 * Ex)1은 관리자, 0는 유저
 * 
 * token: 유효성 관리를 위해서 사용할 수 있다.
 */