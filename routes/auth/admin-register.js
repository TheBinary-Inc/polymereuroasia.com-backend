const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const varify_admin = require("../../middlewares/verify-admin");
const Admin = require("../../models/Admin");
const admin_register = express.Router();

admin_register.post("/register", varify_admin, (req, res) => {
    const { username, password } = req.body;
    const schema = Joi.object({
        username: Joi.string().alphanum().min(5).max(1024).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).alphanum().min(8).max(1024).required()
    })
    const validation = schema.validate({username, password});
    const saltLength = 10;
    if(!validation.error){
        try{
            const hasAdminCredencials = Admin.findOne({username});
            if(!hasAdminCredencials){
                bcrypt.genSalt(saltLength, function(err, salt) {
                    bcrypt.hash(validation.value.password, salt, async function(err, hash) {
                        if(hash){
                            const newAdmin = await Admin.create({
                                username: validation.value.username,
                                password: hash
                            })
                            if(newAdmin){
                                res.status(201).json({
                                    message: "New admin has successfully created!",
                                    admin: newAdmin
                                })
                            }
                        }
                        else{
                            res.status(500).json({
                                message: "Internal server error!"
                            })
                        }
                    });
                });
            }
            else{
                res.status(409).json({
                    message: "Already registered account!"
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

module.exports = admin_register;