/// PRODUCT Model
const Product = require('../models/Product');
const Action = require('../models/Action');

const jwt = require('../utils/jwt.utils');


module.exports = productController = {

    /**
     * FindAll Products
     */
    findAll: async (req, res) => {
        try {
            // I search all products on data
            const products = await Product.findAll();
            if(products) {
                // If i result, i send all products
                return res.send(products);
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
     * FindOne for select one product
     */
    findOne: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }
            // I search this product with id
            const product = await Product.findOne(id);
            if(product == false) {
                return res.send({"error": "Pas de résultat trouvé."});
            }
            return res.send(product);
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

            const nbSav = await Product.countProducts();
            const nbPage = Math.ceil(nbSav/nbElement);
            const limit = nbElement;
            const data = {
                "nbPages" : nbPage
            };

            if(page == 1){
                const offset = 0;
                const products = await Product.paginate(limit,offset);
                data.products = products;
            }else{
                const offset = (page-1) * nbElement;

                const products = await Product.paginate(limit,offset);
                data.products = products;
            }


            return res.send(data);
        } catch (error) {
            console.log(error);
            return res.send(error);
        }   
    },


    /**
     * SAVE TAG
     */
    add: async (req, res) => {
        try {
            const {ref, name, price, mesure} = req.body;
            // Check exist name
            if(name) {
                const product = new Product({
                    ref,
                    name,
                    price,
                    mesure
                });
                // Save this new product
                const result = await product.save();
                // is the result is good
                if(result !== false){
                    // Send data for the new product
                    return res.send(result);
                }else{
                    // or send an error with status code 403
                    return res.status(403).send({"error": "Une erreur s'est produite lors de la sauvegarde du Product."});
                }
            }
            return res.status(403).send({"error": "Vous n'avez pas complété tous les champs."});
        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }
    },

    /**
     * Edit Product
     */
    edit: async (req, res) => {
        try {
            const id = req.params.id;
            // If no id, i send an error with message
            if(!id) {
                return res.status('403').send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            let { ref, name, price, mesure } = req.body;

            // I search this product with id
            const product = await Product.findOne(id);
            if(product == false) {
                return res.send({"error": "Pas de résultat trouvé pour éditer le product."});
            }
            // if not body params i save hold values
            if(!ref) {
                ref = product.ref;
            }
            if(!name) {
                name = product.name;
            }
            if(!price) {
                price = product.price;
            }
            if(!mesure) {
                mesure = product.mesure;
            }

            // edit product with class
            const result = await Product.edit(product.id, ref, name, price, mesure);
            if(result == false) {
                return res.status(403).send({"error": "Une erreur s'est produite lors de la modification du Product."});
            }else{
                return res.send(result);
            }

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

            const result = await Product.archive(id);
            if(result) {
                return res.send(true);
            }else{
                return res.send(false);
            }
        } catch (error) {
            console.log(error);
            return res.status(403).send(error);
        }        
    },

    addProductOnSav: async (req, res) => {
        try {
            const {idSav, idProduct} = req.params;

            if(!idSav || !idProduct){
                return res.send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            let headerAuth = req.headers.authorization;
            // On récupère l'id stocké dans le code
            const userId = jwt.getUserId(headerAuth);

            const result = await Product.addProductOnSav(idSav,idProduct,userId);
            if(result){
                await Action.addActionOnSav(5, idSav, userId);
                return res.send(result);
            }else{
                return res.send({"error": "Une erreur s'est produite lors de l'ajout du produit à la fiche."});
            }

        } catch (error) {
            console.log(error);
            return res.send(false);
        }
    },


    productBySav : async (req, res) => {
        try{
            
            const idSav = req.params;
            if(!idSav) {
                return res.send({"error": "Il vous manque un paramètre pour effectuer votre demande."});
            }

            const result = await Product.productBySav(idSav);
            if(!result){
                return res.send([]);
            }else{
                return res.send(result);
            }

        }catch(error) {
            console.log(error);
            return res.send(false);
        }
    },

    deleteProductOnSav : async (req, res) => {
        try {
            const {id} = req.params;
            if(!id) {
                return res.send({'error': "Il manque un paramètre pour éxécuter votre demande."});
            }

            const result = await Product.deleteProductOnSav(id);
            if(!result){
                return res.send(false);
            }

            return res.send(true);

        } catch (error) {
            console.log(error);
            return res.send(false);
        }
    }

};
