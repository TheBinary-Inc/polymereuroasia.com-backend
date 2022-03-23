const express = require("express");
const Admin = require("../../models/Admin");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admin_login = express.Router();

admin_login.post("/auth", async (req, res) => {
    const { username, password } = req.body;
    const schema = Joi.object({
        username: Joi.string().alphanum().min(5).max(1024).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).alphanum().min(8).max(1024).required()
    })
    const validation = schema.validate({username, password});
    if(!validation.error){
        try{
            const hasAdminCredencials = await Admin.findOne({username}).lean();
            if(hasAdminCredencials){
                bcrypt.compare(validation.value.password, hasAdminCredencials.password, function(err, result) {
                   if(result){
                        jwt.sign({ admin: hasAdminCredencials._id },process.env.TOKEN_SECRET_KEY, {expiresIn: "30d"}, function(err, token) {
                            if(token){
                                const {password, ...adminCredencials} = hasAdminCredencials;
                                res.status(200).json({
                                    message: "Successfully logged in!",
                                    admin: adminCredencials,
                                    token
                                })
                            }
                            else{
                                res.status(500).json({
                                    message: "Internal server error!"
                                })
                            }
                        });
                   }
                   else{
                        res.status(200).json({
                            message: "Password or Username is incorrect!"
                        })
                   }
                }) 
            }
            else{
                res.status(404).json({
                    message: "User with this credencial not found!"
                })
            }
        }
        catch(err){
            res.status(500).json({
                message: "Internal server error!"
            })
        }
    }
    else{
        res.status(400).json({
            message: validation?.error.details[0].message
        })
    }
})

module.exports = admin_login;