/// CUSTOMER CONTROLLER
const Customer = require('../models/Customer');
const Action = require('../models/Action');

// Verify Email Module
const validateEmail = require('../utils/mail.utils');

module.exports = customerController = {

    /**
     * FindAll Customers
     */
    findAll: async (req, res) => {
        try {
            // I search all customers on data
            const customers = await Customer.findAll();
            if(customers) {
                // If i result, i send all customers
                return res.send(customers);
            }else{
                // or i send an error
                return res.status(403).send({"error" : "Une erreur s'est produite."});
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    /**
     * FindOne for select one customer
     */
    findOne: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            // I search this customer with id
            const customer = await Customer.findOne(id);
            if(customer == false) {
                return res.send({"error": "Pas de résultat trouvé."});
            }
            return res.send(customer);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    /**
     * SAVE CUSTOMER
     */
    add: async (req, res) => {
        try {
            let {firstname, lastname, mail, phone, phone_two, customer_detail } = req.body;
            // Check exist firstname and lastname
            if(lastname) {
                if(!firstname) {
                    firstname = ' ';
                }
                const customer = new Customer({
                    firstname,
                    lastname,
                    phone,
                    phone_two,
                    customer_detail
                });


                if(mail){
                    // I verify new mail
                    if(!validateEmail.validate(mail)){
                        return res.send({"error": "Votre adresse Email n'est pas correct."});
                    }

                    customer.mail = mail;

                }else{
                    customer.mail = '';
                }

                // Save this new customer
                const result = await customer.save();
                // is the result is good
                if(result !== false){
                    // Send data for the new customer
                    return res.send(result);
                }else{
                    // or send an error with status code 403
                    return res.status(403).send({"error": "Une erreur s'est produite lors de la sauvegarde du client."});
                }
            }
            return res.status(403).send({"error": "Vous n'avez pas complété tous les champs."});
        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }
    },

    /**
     * Edit Customer
     */
    edit: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            let {firstname, lastname, mail, phone, phone_two, customer_detail } = req.body;

            // I search this customer with id
            const customer = await Customer.findOne(id);
            if(customer == false) {
                return res.send({"error": "Pas de résultat trouvé pour éditer le client."});
            }
            // if not body params i save hold values
            if(!firstname) {
                firstname = customer.firstname;
            }
            if(!lastname) {
                lastname = customer.lastname;
            }
            if(!mail) {
                mail = customer.mail;
            }
            if(!phone_two){
                phone_two = customer.phone_two;
            }
            if(!customer_detail){
                customer_detail = customer.customer_detail;
            }
            if(!phone) {
                phone = customer.phone;
            }
            
            if(mail) {
                if(!validateEmail.validate(mail)){
                    return res.send({"error": "Votre adresse Email n'est pas correct."});
                }
            }


            // edit customer with class
            const result = await Customer.edit(customer.id, firstname, lastname, mail, phone, phone_two, customer_detail);
            if(result == false) {
                res.status(403).send({"error": "Une erreur s'est produite lors de la modification du Client."});
            }else{
                return res.send(result);
            }

        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    pagination: async (req, res) => {
        try {

            const {page, nbElement } = req.params;
            // If no id, i send an error with message
            if(!page && !nbElement) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            const nbSav = await Customer.countCustomers();
            const nbPage = Math.ceil(nbSav/nbElement);
            const limit = nbElement;
            const data = {
                "nbPages" : nbPage
            };

            if(page == 1){
                const offset = 0;
                const customers = await Customer.paginate(limit,offset);
                data.customers = customers;
            }else{
                const offset = (page-1) * nbElement;
                const customers = await Customer.paginate(limit,offset);
                data.customers = customers;
            }
            
            return res.send(data);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }   
    },

    /**
     * Archive a customer
     */
    archive: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            const result = await OrderRepair.archive(id);    
            if(result){
                return res.send(true);
            }else{
                return res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    }

};
