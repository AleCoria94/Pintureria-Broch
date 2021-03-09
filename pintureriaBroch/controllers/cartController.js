const fs = require('fs');
const { sequelize } = require('../database/models');
const db = require("../database/models");
let {check, validationResult,body}= require('express-validator');
const { info } = require('console');


const cartController = {

addProduct:function(req, res,next) {   
res.send("Llego algo")
            /*Buscamos el id del usuario*/
            db.User.findOne({
                where: {
                    email: req.session.userLogged.email
                }
            }).then(function(result){
                req.session.userid = result.id;
                db.Cart.findOne({
                    where:{
                        user_id: req.session.userid,
                        status:1
                    }
                }).then((result)=>{
                    // Si el carrito está creado, agrega el producto
                    if(result != null){
                        console.log(result);
                        
                    //Si no es asi, crealo el carrito y tenemos que agregar el producto al carrito
                    } else {

                    console.log('Estas creando el carrito!');
                        db.Cart.create({
                            user_id: req.session.userid,
                            status: 1,
                            total: 0
                        }).then(function(result){
                            db.Cart_Product.create({
                                cart_id: result.id,
                                product_id: req.params.id
                            })
                            db.Product.findByPk(req.params.id)
                            .then(function(product){
                                db.Cart.update({total: product.price}, {
                                    where:{
                                      user_id: req.session.userid
                                    }
                                })
                            })
                            return res.redirect("/products");
                        }) 
                    }
                })
            })  
        },
deleteProductCart:function(req, res,next) {res.send( "delete")
},
viewCart : function(req, res, next){
    res.render('cart');
   /* db.Cart.findOne({
        where:
        {
            user_id: userid,
            status:"activo"
        },
    })
    .then( info => {
        if(info){
        req.session.carrito_id = info.id;
        res.render("/cart", {info: info})
        } else {
            res.render("/cart")
        }
    })
*/
},
}

module.exports = cartController;