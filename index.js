const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://sungjun:62agnc7ujksgyEc1@atlascluster.crdxrmw.mongodb.net/", {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(() => console.log('MongoDB connected..!!!'))
.catch((err)=> {console.log(err)})



app.get('/', (req, res) => {
    res.send('Hello World !!!');
});

app.listen(port, () => {
    console.log(`Express app listening on port ${port}`)
})


/**
 * mongodb+srv://sungjun:62agnc7ujksgyEc1@atlascluster.crdxrmw.mongodb.net/
 */