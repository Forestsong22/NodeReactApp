const express = require('express');
const app = express();
const port = 5000;
const config = require("./config/dev");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { User } = require('./model/User');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// application/json
app.use(bodyParser.json());

mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB connected..!!!'))
.catch((err)=> {console.log(err)})



app.get('/', (req, res) => {
    res.send('차근차근 하자.. 지치지 말자 !!!');
});



app.post('/register', (req, res) => {
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







app.listen(port, () => {
    console.log(`Express app listening on port ${port}`)
})


/**
 * mongodb+srv://sungjun:62agnc7ujksgyEc1@atlascluster.crdxrmw.mongodb.net/
 */