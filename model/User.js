const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;


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

/**
 * pre() : mongoose에서 가져온 메서드
 * save하기 이전에 작업하는 코드.
 * 
 * saltRounds : salt를 몇 글자로 할지 정의하는 것. ->
 * salt를 먼저 생성 -> salt를 이용해서 비밀번호를 암호화 해야함.
 * 
 * bcrypt.hash(암호화되기전의 비밀번호,salt, )
 */
userSchema.pre('save', function(next){
    // 위에 있는 userSchema를 가리키는 것이다.
    let user = this;


    // 비밀번호가 바뀔 때만 암호화 시켜주는 조건문
    if(user.isModified('password')){
        // 비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt){
        if(err) return next(err)

        bcrypt.hash(user.password, salt, function(err, hash){
            if(err) return next(err)
            
            // hash된 비밀번호로 바꿔준다.
            user.password = hash
            next()
        });
    });
    } else {
        next()
    } 
});

/** 
 * userSchema.methods.comparePassword를 바꾸고 싶다면
 * index.js에서도 comparePassword가 바뀐 이름으로 똑같이 바꿔준다.
*/

userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword : 12341234, 암호화된 비밀번호 : $2b$10$lmui70wG35vI5WZr4jThYez3O0DfLh5GlWGuXf.ZGtQNCcP30d1dG
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb){
    let user = this;

    // jsonwebtoken을 이용해서 토큰 생성하기.
    // 몽고DB에 있는 아이디를 가져온다.
    // id랑 + 'secretToken' 이랑 합쳐서 token화
    let token = jwt.sign(user._id.toHexString(), 'secretToken')

    user.token = token
    user.save().then((err, user) => {
        if (err) return cb(err);
        cb(null, user)
    });
}

userSchema.statics.findByToken = function(token, cb) {
    let user = this;

    // 토큰을 decode 한다.
    jwt.verify(token, 'secretToken', function(err, decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라이언트에서 가쟈온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.fineOne({'_id': decoded, 'token': token}, function(err, user){
            if (err) return cb(err);
            cb(null, user);
        })
    })
}



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