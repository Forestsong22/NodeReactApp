const express = require('express');
const app = express();
const config = require("./config/dev");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { User } = require('./model/User');
const { auth } = require('./middleware/auth');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser);

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB connected..!!!'))
.catch((err)=> {console.log(err)})



app.get('/', (req, res) => {
    res.send('차근차근 하자.. 지치지 말자 !!!');
});



app.post('/api/users/register', (req, res) => {
    // 회원가입 할 떄 필요한 정보들을 client에서 가져오먄
    // 그 정보들을 데이터베이스에 넣어준다.
    const user = new User(req.body)
    
    // save는 몽고DB에서 오는 메서드이다.
    // user모델에 정보가 저장된다.
    // 실패 시 실패한 정보를 보내준다.
    user.save().then(()=> {
        res.status(200).json({
            success: true
        })
    }).catch((err) => {
        return res.json({success: false, err})
    })
});


app.post('/api/users/login', (req, res) => {

    // 1) 요청된 이메일을 데이터베이스에서 있는지 찾는다.    
    User.findOne({email: req.body.email})
    .then((data) => {
        if(!data){
            return res.json({
                loginSuccess: false, 
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
        
        data.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀립니다."})
        // password가 일치하면 토큰 생성
            data.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                res.cookie('x_auth', user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id})
            })
        })
    })
});

app.get('/api/users/auth', auth,  (req, res) => {
    // 여기까지 미들웨어를 통과해 왔다는 얘기는
    // Authentication이 true라는 뜻.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
});

app.get('/api/users/logout', auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id},
        { token: ""},
        (err, user) => {
            if(err) return res.json({ success: false, err});
            return res.status(200).send({
                success: true
            });
        });
});



const port = 5000;
app.listen(port, () => {
    console.log(`Express app listening on port ${port}`)
})


/**
 * mongodb+srv://sungjun:62agnc7ujksgyEc1@atlascluster.crdxrmw.mongodb.net/
 */