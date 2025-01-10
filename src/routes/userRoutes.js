const express=require("express");
const verifyToken=require("../middlewares/authMiddleware");
const authorizeRoles=require("../middlewares/rolemiddleware");
const router=express.Router();

router.get("/admin",verifyToken, authorizeRoles("admin"),(req,res)=>{
    res.json({message:`Welcome admin`});
});

router.get("/manager",verifyToken, authorizeRoles("admin","manager"),(req,res)=>{
    res.json({message:`Welcome manager`});
});

router.get("/user",verifyToken, authorizeRoles("admin","manager","user"),(req,res)=>{
    res.json({message:`Welcome user`});
});

module.exports=router;