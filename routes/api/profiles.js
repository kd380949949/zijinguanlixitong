const express =require("express");
const router = express.Router();
const Profile = require("../../models/Profile");
const passport = require("passport");


//$route GET api/profiles/test
//@desc 返回请求的json数据测试router
//@access public
router.get("/test",(req,res)=>{  
    res.json({msg:"profile works"})
});

//$route POST api/profiles/add
//@desc 添加信息接口
//@access private
router.post("/add",passport.authenticate("jwt",{session:false}),(req,res)=>{
    const profileFields = {};
    //判断 当前浏览器有没有提交相应信息
    if(req.body.type){profileFields.type = req.body.type };
    if(req.body.describe){profileFields.describe = req.body.describe };
    if(req.body.income){profileFields.income = req.body.income };
    if(req.body.expend){profileFields.expend = req.body.expend };
    if(req.body.cash){profileFields.cash = req.body.cash };
    if(req.body.remark){profileFields.remark = req.body.remark };
    new Profile(profileFields).save().then(profile=>{
        res.json(profile);
    })
})

//$route GET api/profiles
//@desc 获取所有信息
//@access private
router.get("/",passport.authenticate("jwt",{session:false}),(req,res)=>{  
    Profile.find().then(profile=>{   //查找全部符合的信息
        if(!profile){
            return res.status(404).json("没有任何内容！")
        }
        res.json(profile);
        // console.log(req.user);//req.user就是token中解析出来的
    }).catch(err=>res.status(404).json(err));
});
//$route GET api/profiles/:id
//@desc 获取单个信息
//@access private
router.get("/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{  
    Profile.findOne({_id:req.params.id})
    .then(profile=>{   //查找全部符合的信息
        if(!profile){
            return res.status(404).json("没有相应内容！")
        }
        res.json(profile);
        // console.log(req.user);//req.user就是token中解析出来的
    }).catch(err=>res.status(404).json(err));
});

//$route POST api/profiles/edit
//@desc 编辑信息接口
//@access private
router.post("/edit/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{
    const profileFields = {};
    //判断 当前浏览器有没有提交相应信息
    if(req.body.type){profileFields.type = req.body.type };
    if(req.body.describe){profileFields.describe = req.body.describe };
    if(req.body.income){profileFields.income = req.body.income };
    if(req.body.expend){profileFields.expend = req.body.expend };
    if(req.body.cash){profileFields.cash = req.body.cash };
    if(req.body.remark){profileFields.remark = req.body.remark };
    Profile.findOneAndUpdate(
        {_id:req.params.id},
        {$set:profileFields},
        {new:true}
    ).then(profile=>{res.json(profile)});   
});

//$route Delete api/profiles/delete/:id
//@desc 删除信息
//@access private
router.delete("/delete/:id",passport.authenticate("jwt",{session:false}),(req,res)=>{  
    Profile.findOneAndRemove({_id:req.params.id}).then(profile=>{ 
        // console.log(profile); //会返回删除的那条信息
        profile.save().then(profile=>{res.json(profile)});
    }).catch(err=>{res.status(404).json("删除失败")});
});

module.exports = router;
