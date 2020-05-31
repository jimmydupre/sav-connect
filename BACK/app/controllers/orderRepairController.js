// FS for save pictures
const fs = require('fs');

// Utils
const jwt = require('../utils/jwt.utils');
const validateEmail = require('../utils/mail.utils');

/// ORDER REPAIR MODEL
const OrderRepair = require('../models/OrderRepair');
// CUSTOMER MODEL
const Customer = require('../models/Customer');
const Action = require('../models/Action');
const Product = require('../models/Product');


module.exports = orderRepairController = {

    getStepFourDelete: async (req, res) => {
        try {
            const {order_number, idGallery} = req.params;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;
            !idGallery ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;

            const result = await OrderRepair.getStepFourDelete({
                order_number,
                idGallery
            });

            if(!result){
                return res.send(false);
            }
            return res.send(true)

        } catch (error) {
            console.log(error);
            return res.send(false);
        }
    },

    getStepFour: async (req, res) => {
        try {
            const order_number = req.params.order_number;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;

            const result = await OrderRepair.getStepFour(order_number);
            result ? res.send(result) : res.send(false);

        } catch (error) {
            console.log(error);
            return res.send(false);
        }
    },


    postStepFour: async (req, res) => {
        try {
            const order_number = req.params.order_number;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;

            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code

            if(req.files){
                const date = new Date();
                const name = date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear()+'-'+date.getSeconds()+'.jpg';
                // Save file in folder /uploads/
                if (Object.keys(req.files).length != 0) {
                    const srcPath = req.files.picture.tempFilePath
                    const distPath = req.app.locals.BASEDIR + '/uploads/' + name;
                    await fs.copyFileSync(srcPath, distPath);
                    await fs.unlinkSync(srcPath);
                }

                let headerAuth = req.headers.authorization;
                // On récupère l'id stocké dans le code
                const userId = jwt.getUserId(headerAuth);

                const result = await OrderRepair.postStepFour({
                    name,
                    order_number,
                    userId
                });

                result ? '' : res.send(false);


                // await Action.addActionOnSav(4, order_number, userId);
    
                return res.send(result);

            }
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    getStepFive: async (req, res) => {
        try {
            const order_number = req.params.order_number;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;

            const result = await OrderRepair.getStepFive(order_number);

            const id = result[0].id;
            
            const products = await Product.productBySav(id);
            if(products){
                result[0].products = products;
            }
            console.log(result);
            if(!result){
                return res.send({"error": "Pas de résultat"});
            }
            
            return res.send(result);

        } catch (error) {
            console.log(error);
            return false;
        }
    },

    patchStepFive: async (req, res) => {
        try {
            const order_number = req.params.order_number;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;
            let {devis_is_accepted, date_devis, amount_devis, amount_diag, recall_devis, order_number_id } = req.body;
            !devis_is_accepted ? devis_is_accepted='' : '';
            !date_devis ? date_devis=null : '';
            !amount_devis ? amount_devis=null : '';
            !amount_diag ? amount_diag=null : '';
            recall_devis ? recal_devis = parseInt(recall_devis, 10) : null;
            !recall_devis ? recall_devis=null : '';

            // date_devis == 'undefined' ? date_devis=null : '';

            const result = await OrderRepair.patchStepFive({
                devis_is_accepted,
                date_devis,
                amount_devis,
                amount_diag,
                recall_devis,
                order_number
            });

            if(!result){
                return res.send({"error": "Une erreur s'est produite lors de la modification."});
            }

            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);
            await Action.addActionOnSav(4, order_number_id, userId);

            return res.send(true);

        } catch (error) {
            console.trace(error);
            return res.send(false);
        }
    },


    getStepThree: async (req, res) => {
        try {
            const order_number = req.params.order_number;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;

            const result = await OrderRepair.getStepThree(order_number);
            !result ? res.send({"error": "Pas de résultat"}) : res.send(result);

        } catch (error) {
            console.log(error);
            return false;
        }
    },

    patchStepThree: async (req, res) => {
        try {
            const order_number = req.params.order_number;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;

            let {intervention, date_intervention, order_number_id } = req.body;
            
            !intervention ? intervention='' : '';
            !date_intervention ? date_intervention=null : '';

            const result = await OrderRepair.patchStepThree({
                intervention,
                date_intervention,
                order_number
            });

            !result ? res.send({"error": "Une erreur s'est produite lors de la modification."}): ''; 

            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);
            await Action.addActionOnSav(4, order_number_id, userId);
            
            return res.send(true);

        } catch (error) {
            console.log(error);
            return false;
        }
    },

    getStepTwo: async (req, res) => {
        try {
            const order_number = req.params.order_number;
            !order_number ? res.send({"error": "Il manque un paramètre pour éxécuter votre demande"}) :  '' ;

            const result = await OrderRepair.getStepTwo(order_number);
            !result ? res.send({"error": "Pas de résultat"}) : res.send(result);

        } catch (error) {
            console.log(error);
            return false;
        }
    },

    patchStepTwo: async (req, res) => {
        try {
            
            const order_number = req.params.order_number;

            if(!order_number){
                return res.send({"error": "Il manque un paramètre pour éxécuter votre demande."})
            }

            let { device_brand, interval_repair, panne, order_number_id } = req.body;

            if(!device_brand){
                device_brand = '';
            }

            if(!interval_repair){
                interval_repair = null;
            }
            
            if(!panne){
                panne = '';
            }

            const result = await OrderRepair.patchStepTwo({
                device_brand,
                interval_repair,
                panne,
                order_number
            });

            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);
            const resultAction = await Action.addActionOnSav(4, order_number_id, userId);

            result ? res.send(true) : res.send(false);


        } catch (error) {
            console.log(error);
            return false;
        }
    },

    getStepOne: async (req, res) => {
        try {
            const order_number = req.params.order_number;
            
            if(!order_number){
                return res.send({"error": "Vous n'avez le paramètre nécéssaire."});
            }

            const result = await OrderRepair.getStepOne(order_number);
            if(!result){
                return res.send({"error":"Pas de résultat"});
            }


            return res.send(result);
        } catch (error) {
            console.log(error);
            return false;
        }
    },

    postStepOne: async (req, res) => {
        try {
            if(!req.body){
                return res.send({"error": "Vous n'avez pas complété le formulaire."});
            }
            let { customer_id, firstname, lastname, mail, phone, phone_two, customer_detail,device_name } = req.body;

            if(!device_name){
                return res.send({"error": "Vous n'avez pas complété de nom d'appareil."});
            }
            customer_id == 'undefined' ? customer_id=null : '';
            customer_id == 'Choisissez un client' ? customer_id=null : '';
            // J'ai pas de client doncc je créer le client pour la fiche
            if(customer_id == 'null' || !customer_id){
                if(lastname) {
                    if(!firstname){
                        firstname = ' '; //TODO: FAIRE UNE MIGRATION POUR CORIGER CA
                    }
                    const customer = new Customer({
                        firstname,
                        lastname,
                        phone,
                        phone_two,
                        customer_detail
                    });
    
                    // Je vérifie le mail
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
                    if(result == false){
                        // Send data for the new customer
                        // or send an error with status code 403
                        return res.status(403).send({"error": "Une erreur s'est produite lors de la sauvegarde du client."});
                    }else{
                        customer_id = result.id;
                        console.log(customer_id);
                    }
               }
            }
            customer_id = parseInt(customer_id,10);
            const result = await OrderRepair.postStepOne({
                customer_id,
                device_name
            });

            if(!result){
                return res.send({"error": "Une erreur s'est produite lors de la création de la fiche."});
            }

            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);
            await Action.addActionOnSav(2,result.id,userId);

            return res.send({"order_number": result});

        } catch (error) {
            console.log(error);
            return res.send(false);
        }
    },



    /**
     * FindAll OrderRepairs
     */
    findAll: async (req, res) => {
        try {
            // I search all order_repairs on data
            const order_repairs = await OrderRepair.findAll();
            if(order_repairs) {
                // If i result, i send all order_repairs
                return res.send(order_repairs);
            }else{
                // or i send an error
                return res.status(403).send({"error" : "Une erreur s'est produite."});
            }
        } catch (error) {
            console.log(error);
            res.send(error);
        }
    },

    /**
     * FindOne for select one order_repair
     */
    findOne: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            // I search this order_repair with id
            const order_repair = await OrderRepair.findOne(id);
            if(order_repair == false) {
                return res.send({"error": "Pas de résultat trouvé."});
            }
            return res.send(order_repair);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }
    },

    /** 
     * 
     * SAVE SAV
     */
    add: async (req, res) => {
        try {
            let { 
                device_name,
                device_brand,
                interval_repair,
                urgent,
                customer_id,
                firstname,
                lastname,
                mail,
                phone,
                phone_two,
                customer_detail,
                pictures
            } = req.body;

            if(customer_id){
                // update customer
                let customer = await Customer.findOne(customer_id);
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
                
                if(!validateEmail.validate(mail)){
                    return res.send({"error": "Votre adresse Email n'est pas correct."});
                }

                customer = await Customer.edit(customer.id, firstname, lastname, mail, phone, phone_two, customer_detail);

                if(customer == false) {
                    res.status(403).send({"error": "Une erreur s'est produite lors de la modification du Client."});
                }else{
                    customer_id = customer.id;
                }
            }else{
                // create customer
                const customer = new Customer({
                    firstname,
                    lastname,
                    mail,
                    phone,
                    phone_two,
                    customer_detail
                });
                const result = await customer.save();
                customer_id = result.id;
            }
            let customer = await Customer.findOne(customer_id);
            if(!device_name || !customer_id) {
                return res.status(403).send({"error": "Vous n'avez pas complété tous les champs obligatoire (nom de l'appareil, id du client, id de l'employé, panne de l'appareil)."});
            }

            // New instance Order_repair
            const order_repair = new OrderRepair({
                device_name,
                customer_id,
            });

            if(device_brand){
                order_repair.device_brand = device_brand;
            }

            if(interval_repair){
                order_repair.interval_repair = interval_repair;
            }

            if(urgent && urgent == 1){
                order_repair.urgent = urgent;
            }

            if(req.files){
                // Save file in folder /uploads/
                if (Object.keys(req.files).length != 0) {
                    order_repair.picture = req.files.pictures.name;
                    const srcPath = req.files.pictures.tempFilePath
                    const distPath = req.app.locals.BASEDIR + '/uploads/' + req.files.pictures.name;
                    await fs.copyFileSync(srcPath, distPath);
                }
            }

           let headerAuth = req.headers.authorization;
           // On récupère l'id stocké dans le code
           const userId = jwt.getUserId(headerAuth);
           const result = await order_repair.save();
           // is the result is good
           if(result !== false){
                // ATTENTION il va faloir relier la fiche avec l'employé pour l'historique en récuupérant l'id de l'user dans le token
                const isOk = await OrderRepair.addUserInSav(result.id, userId);

                if(isOk) {
                    // Send data for the new order_repair
                    result.customer = customer;

                    // const resultAction = await Action.addActionOnSav(2,result.customer.id,userId);

                    res.send(result);
                }else{
                    res.status(403).send({"error": "Une erreur s'est produite lors de la sauvegarde du OrderRepair."});
                }
            }else{
                    // or send an error with status code 403
                res.status(403).send({"error": "Une erreur s'est produite lors de la sauvegarde du OrderRepair."});
            }
            
        } catch (error) {
            console.log(error);
            res.status(403).send(error);
        }
    },

    /**
     * Edit OrderRepair
     */
    edit: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }


            
            let { pictures, device_name, device_brand, device_model,interval_repair, urgent, panne, intervention, date_intervention, date_devis, amount_devis, amount, amount_diag, recall_devis,recall_finish } = req.body;

            // I search this order_repair with id
            const order_repair = await OrderRepair.findOne(id);

            if(device_name){
                order_repair.device_name = device_name;
            }
            if(device_brand){
                order_repair.device_brand = device_brand;
            }
            if(device_model){
                order_repair.device_model = device_model;
            }
            if(interval_repair){
                order_repair.interval_repair = interval_repair;
            }
            if(urgent){
                order_repair.urgent = urgent;
            }
            if(panne){
                order_repair.panne = panne;
            }
            if(intervention){
                order_repair.intervention = intervention;
            }
            if(date_intervention){
                order_repair.date_intervention = date_intervention;
            }
            if(date_devis){
                order_repair.date_devis = date_devis;
            }
            if(amount_diag){
                order_repair.amount_diag = amount_diag
            }
            if(amount){
                order_repair.amount = amount;
            }
            if(amount_devis){
                order_repair.amount_devis = amount_devis;
            }
            if(recall_devis){
                order_repair.recall_devis = parseInt(recall_devis, 10);
            }
            if(recall_finish){
                order_repair.recall_finish = parseInt(recall_finish, 10);
            }

            const order = new OrderRepair(order_repair);
            const result = await order.edit();

            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);

            
            if(result == false) {
                res.status(403).send({"error": "Une erreur s'est produite lors de la modification du OrderRepair."});
            }else{
                await Action.addActionOnSav(4,id,userId);
                return res.send(true);
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

            const nbSav = await OrderRepair.countOrderRepair(1);
            const nbPage = Math.ceil(nbSav/nbElement);
            const limit = nbElement;
            const data = {
                "nbPages" : nbPage
            };

            if(page == 1){
                const offset = 0;
                const savs = await OrderRepair.paginate(limit,offset,1);
                data.savs = savs;
            }else{
                const offset = (page-1) * nbElement;
                const savs = await OrderRepair.paginate(limit,offset,1);
                data.savs = savs;
            }

            return res.send(data);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }   
    },

    paginationArchive: async (req, res) => {
        try {

            const {page, nbElement } = req.params;
            // If no id, i send an error with message
            if(!page && !nbElement) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            const nbSav = await OrderRepair.countOrderRepair(0);
            const nbPage = Math.ceil(nbSav/nbElement);
            const limit = nbElement;
            const data = {
                "nbPages" : nbPage
            };

            if(page == 1){
                const offset = 0;
                const savs = await OrderRepair.paginate(limit,offset,0);
                data.savs = savs;
            }else{
                const offset = (page-1) * nbElement;

                const savs = await OrderRepair.paginate(limit,offset,0);
                data.savs = savs;
            }


            return res.send(data);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }   
    },

    archive: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            const result = await OrderRepair.archive(id);
            if(result) {
                let headerAuth = req.headers.authorization;
                // On récupère l'id stocké dans le code
                const userId = jwt.getUserId(headerAuth);
                await Action.addActionOnSav(3,id,userId);
                res.send(true);
            }else{
                res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }        
    },





};
