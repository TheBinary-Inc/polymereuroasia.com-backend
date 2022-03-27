const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const varify_admin = require("../../middlewares/verify-admin");
const Admin = require("../../models/Admin");
const admin_register = express.Router();

admin_register.post("/register", varify_admin, async (req, res) => {
    const { username, password } = req.body;
    const schema = Joi.object({
        username: Joi.string().alphanum().min(5).max(1024).required(),
        password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).alphanum().min(8).max(1024).required()
    })
    const validation = schema.validate({username, password});
    const saltLength = 10;
    if(!validation.error){
        try{
            const hasAdminCredencials = await Admin.findOne({username});
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
                                    message: "Yangi admin muvaffaqiyatli yaratildi!",
                                    admin: newAdmin
                                })
                            }
                        }
                        else{
                            res.status(500).json({
                                message: "Serverda ichki muammo!"
                            })
                        }
                    });
                });
            }
            else{
                res.status(409).json({
                    message: "Allaqachon bunday admin bor!"
                })
            }
        }
        catch(err){
            res.status(500).json({
                message: "Serverda ichki muammo!"
            })
        }
    }
    else{
        res.status(400).json({
            message: "Foydalanuchi nomi yoki parol yaroqli emas!"
        })
    }
})

module.exports = admin_register;