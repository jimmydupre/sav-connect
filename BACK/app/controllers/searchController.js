/// TAG CONTROLLER
const Customer = require('../models/Customer');
const Product = require('../models/Product');
const OrderRepair = require('../models/OrderRepair');

module.exports = searchController = {


        user: async (req, res) => {
            try {
                const search = req.query.q;
                // Search Customer with lastname, firstname, phone
                const result = await Customer.findByLastnameFirstnamePhone(search.toLowerCase());

                result ? res.send(result): res.send({"error":"Pas de résultat"});

            } catch (error) {
                console.log(error);
                return res.send(false);
            }
        },

        /**
         * Search user with lastname
         */
        userLastname: async (req, res) => {
            try {
                const search = req.query.q;
                // Search Customer with lastname
                const result = await Customer.findByLastname(search.toLowerCase());
                if(result){
                    return res.send(result);
                }else{
                    return res.send(false);
                }
            } catch (error) {
                console.log(error);
                return res.send(error);
            }
        },
        /**
         * Search User with Mail
         */
        userMail: async (req, res) => {
            try {
                const search = req.query.q;
                const result = await Customer.findByMail(search.toLowerCase());
                if(result){
                    return res.send(result);
                }else{
                    return res.send(false);
                }
            } catch (error) {
                console.log(error);
                return res.send(error);
            }
        },

        /**
         * Search user with phone number
         */
        userPhone: async (req, res) => {
            try {
                const search = req.query.q;
                const result = await Customer.findByPhone(search.toLowerCase());
                if(result){
                    return res.send(result);
                }else{
                    return res.send(false);
                }
            } catch (error) {
                console.log(error);
                return res.send(error);
            }
        },

        /**
         * Search Product with Ref
         */
        product: async (req, res) => {
            try {
                const search = req.query.q;
                const result = await Product.findByRefOrName(search.toLowerCase());
                if(result){
                    return res.send(result);
                }else{
                    return res.send(false);
                }
            } catch (error) {
                console.log(error);
                return res.send(error);
            }
        },

        /**
         * Search Repair Order with order_number or device_name
         */
        search: async (req, res) => {
            try {
                const search = req.query.q;

                const result = await OrderRepair.search(search.toLowerCase());
                if(result){
                    return res.send(result);
                }else{
                    return res.send(false);
                }
            } catch (error) {
                console.log(error);
                return res.send(error);
            }
        }

};