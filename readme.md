#### **code .**   在指定文件下的终端页面打开 vscode  ，//有个空格

                                            node中的依赖  必须使用npm安装CDN
1、**npm init** /npm init -y初始化一个package.json  初始化的时候 有指定入口文件名等
2、npm i **<u>nodemon</u>** -g 
之后开启服务器 使用 nodemon server.js 
启动后 <u>当你的 server.js及依赖文件 内容发生变化的时候，就会自动保存</u>
3、连接monogoDB数据库，本项目用的是 monogoDB cloud - mlab.com
4、server.js中 进行route配置（抽离出router ）
5、postman  接口测试  ,模拟页面中发出的请求，后端进行测试，postman就相当于浏览器前端页面
6、 **bcrypt**加密CDN  哪个文件需要用到加密 ，在哪里引入。   **注册时对password加密**
                     bcrypt.genSalt(10, function(err, salt) {  
                       bcrypt.hash(newUser.password, salt, function(err, hash) {
                            newUser.password = hash;
                            newUser.save().then().catch()
                        });
                    });
   //密码匹配     登录时进行密码匹配
    bcrypt.compare(password,user.password) //users数据库中获取到的user中的password  进行比较                  
                      .then(isMatch=>{  //返回的isMatch是匹配结果，true/false
7、**mongoose  schema  model  save findone**
       //配置mongoose
       // 使用findOneAndUpdate()更新数据库的时候，会发现有条警告信息
       //原因是因为:findOneAndUpdate()内部会使用findAndModify驱动，驱动即将被废弃，所以弹出警告！
       //解决：在使用mongose时全局设置  mongoose.set('useFindAndModify', false)
        mongoose.set('useFindAndModify', false)
       
       （1）连接mongoose
         mongoose.connect(db).then(()=>{
            console.log("MongoDB Connected")})
            .catch((err)=>{console.log(err)});
        （2）const Schema = mongoose.Schema;
          //Create Schema   数据库结构，每个schema会映射到MongoDB的一个collection
            const UserSchema = new Schema({
                name:{
                    type:String,
                    required:true
                 },
            })
        （3） module.exports = User = mongoose.model("users",UserSchema); //数据库已经按要求格式创建好,文档
        （4） User.findOne({email:req.body.email}).then(user=>{//没找到的user为null
                if(user){
                        return res.status(400).json("邮箱已被注册！")
                }else{
            （5）   const newUser = new User({
                    name: req.body.name,
                    password: req.body.password//密码需要加密 bcrypt
            });
      （6）  newUser.save(function(err,doc){
                 console.log(doc);
             })
             
    mongoose其他操作指令
      1.1 Profile.find().then(profile=>{})  查找全部
      1.2 Profile.findOneAndUpdate(
            {_id:req.params.id},
            {$set:更新过的数据对象},
            {new:true}
        ).then(profile=>{res.json(profile)}); 
      1.3  Profile.findOneAndRemove({_id:req.params.id}).then(profile=>{ 
            // console.log(profile); //会返回删除的那条信息
            profile.save().then(profile=>{res.json(profile)});
        }).catch(err=>{res.status(404).json("删除失败")});   

8、CDN   **gravatar**
const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});//mm默认头像 pg是图片格式
9、gravatar网站
10、**jwt**  ---jsonwebtoken 
**登录验证时获取token**
    const rule = {id:user.id,name:user.name,identity:user.identity}; //会放到token中
    jwt.sign(rule,"secret",{expiresIn:3600},(err,token)=>{
             res.json({
                success:true,
                //token:"mrwu"+token,
                token:"Bearer "+token  //请求成功后返回给用户一个令牌必须用token:"Bearer "+token，前面的行不通，Bearer后面有一个空格
                })
            })//相当于签名，该方法中要传入1规则2加密名字,通常为“secret”3过期时间3600s4箭头函数
            //获取相应用户的数据信息时候 要带着token去拿，否则拿不到
#### 11、**验证token**

####  **npm i passport-jwt passport**

passport
passport-jwt
//passport初始化
**app.use(passport.initialize());**

    const JwtStrategy = require('passport-jwt').Strategy;
    const ExtractJwt = require('passport-jwt').ExtractJwt;
    const mongoose = require("mongoose");
    const User = mongoose.model("users"); // model可读可写
    //  mongoose.model("users",UserSchema);  //这是model写
    const keys = require("../config/keys");
    
    const opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = keys.secretOrKey;
    
    module.exports = passport => {   //配置passport
    
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
    
        // console.log(jwt_payload)
        //验证token后，得到的信息数据jwt_payload
         //jwt_payload 是包含已解码的JWT有效负载的对象文字
        User.findById(jwt_payload.id).then(user=>{
            if(user){
            
                return done(null,user); //继续执行相应的请求方法，req.user
                
            }else{
                return done(null,false)
            }
        }).catch(err=>{
            console.log(err)
        })
    }));}

// router.get("/current",**"验证token"**,(req,res)=>{})

    router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{//验证token
    // res.json(req.user); //返回用户信息
    res.json({
        // res.json(req.user);
        id:req.user.id,
        name:req.user.name,
        email:req.user.email//注意  这里是 req.user
    })
    })
//get 请求中  加入 token验证
**Authorization**：……相应的token

12、**concurrently**能够将多个终端启动的项目 绑定到一块


   一、先cnpm安装（指定cnpm）
   二、1  在node 的 package.json中进行配置
        "scripts": {
            //-prefix client 指定指令执行的文件夹
            "client-install":"npm install --prefix client", 
            "client":"npm start --prefix client",
            "server": "nodemon server.js",
            "start": "node server.js",
            "dev":"concurrently      \"npm run server\"     \"npm run client\"   "
          },
          一个空格，只是为了看起来明显
​    2  在 vue的package.json中进行配置  start 



    "scripts": {
    	"serve": "vue-cli-service serve",
    	"build": "vue-cli-service build",
    	"start":"npm run serve"
     },

  npm run dev  前后端 都启动起来了，实现了前后端的连载。

13、 //app.use('/api',express.static('client/public'));  //启动主页面index.html