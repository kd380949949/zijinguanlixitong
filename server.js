const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');



//DB config
const db = require("./config/keys").mongoURI;
//引入路由配置
const users = require("./routes/api/users");
const profiles = require("./routes/api/profiles")


//使用body-parser中间件
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//配置mongoose
// 使用findOneAndUpdate()更新数据库的时候，会发现有条警告信息
//原因是因为:findOneAndUpdate()内部会使用findAndModify驱动，驱动即将被废弃，所以弹出警告！
//解决：在使用mongose时全局设置  mongoose.set('useFindAndModify', false)
mongoose.set('useFindAndModify', false)
//mongoose连接
mongoose.connect(db).then(()=>{
    console.log("MongoDB Connected")})
    .catch((err)=>{console.log(err)});

//passport初始化
app.use(passport.initialize());
//配置passport
require("./config/passport")(passport);
// app.use('/api',express.static('client/public'));  //启动主页面index.html

// app.get('/',(req,res)=>{
//     res.send('hello world!')
// })

//使用routes   加虚拟路径 /api/users
app.use("/api/users",users);
app.use("/api/profiles",profiles);

const port = process.env.PORT || 5001;//定义一个port
app.listen(port,()=>{
    console.log(`Server running on port ${port}`)
})