const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require("mongoose");
const User = mongoose.model("users");//model可读可写
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {//配置passport
    passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
        // console.log(jwt_payload)
        //验证token后，得到的token信息数据jwt_payload
        //jwt_payload 是包含已解码的JWT有效负载的对象文字
        User.findById(jwt_payload.id).then(user=>{ //user从数据库里findone出来的
            if(user){
                return done(null,user); //继续执行相应的请求方法，req.user//此处user为传进去的变量传给user形参
            }else{
                return done(null,false);
            }
        }).catch(err=>{
            console.log(err)
        })
    }));

}