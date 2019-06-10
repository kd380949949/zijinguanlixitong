//@login & register
const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../../models/User");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const keys = require("../../config/keys");
const passport = require("passport");


//$route GET api/user/test
//@desc 返回请求的json数据
//@access public
router.get("/test",(req,res)=>{
    res.json({msg:"login works"})
})

//$route POST api/user/register
//@desc 返回请求的json数据
//@access public
router.post("/register",(req,res)=>{
    // console.log(req.body);
    User.findOne({email:req.body.email}).then(user=>{//没找到的user为null
        if(user){
            return res.status(400).json("邮箱已被注册！")
        }else{
            const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});//mm默认头像 pg是图片格式
            // console.log("没被注册")
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar:avatar,
                password: req.body.password,//密码需要加密 bcrypt
                identity:req.body.identity,
            });
            // newUser.save(function(err,doc){
            //     console.log(doc);
            // })
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, (err, hash)=> { //password进行加密
                    // Store hash in your password DB.
                    if(err)throw err;
                    newUser.password = hash;
                    newUser.save().then(user=>res.json(user))//成功后返回数据到前端
                            .catch(err=>console.log(err))
                });
            });
        }
    })
})
//$route POST api/user/login
//@desc 返回token jwt  json-web-token  passport
//@access public
router.post('/login',(req,res)=>{   //我认为逻辑缺少一部分，登录的时候应该进行选择identity*************
    const email = req.body.email;
    const password = req.body.password;
    //数据库中进行查询    1email是否存在，2密码是否正确
    User.findOne({email}).then(user=>{
        // console.log(user);
        if(!user){return res.status(404).json("用户不存在")}
        else{
            //密码匹配
            bcrypt.compare(password,user.password) //users数据库中获取到的user中的password  进行比较
                        .then(isMatch=>{  
                            if(isMatch){  //匹配成功
                                
                                const rule = {  //会放到token中
                                    id:user.id,
                                    name:user.name,
                                    identity:user.identity,
                                    avatar:user.avatar
                                };
                                jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token)=>{
                                    if(err)throw err;
                                    res.json({
                                        success:true,
                                        token:"Bearer "+token,
                                    })
                                })//相当于签名，该方法中要传入1规则2加密名字,通常为“secret”3过期时间3600s4箭头函数
                                // res.json({msg:"success"})
                                //获取相应用户的数据信息时候 要带着token去拿，否则拿不到

                            }else{
                                return res.status(400).json("密码错误")
                            }
                        })
            

        }
    })
})

//$route GET api/user/current
//@desc 返回current user
//@access private.
// router.get("/current","验证token",(req,res)=>{})
router.get("/current",passport.authenticate("jwt",{session:false}),(req,res)=>{ //验证token
   //返回用户信息
//    console.log(req)
    // res.json(req.user);
    res.json({
        id:req.user.id,
        name:req.user.name,
        email:req.user.email,//注意  这里是 req.user
        identity:req.user.identity,
    })
})
        
module.exports = router;