const express = require('express');

const router = express.Router();

const productController = require('../controllers/productController');

/**
 * ROUTES
 **/

router.get('/', productController.findAll);
router.get('/:id', productController.findOne);
router.get('/archive/:id', productController.archive);
router.post('/add', productController.add);
router.patch('/edit/:id', productController.edit);
router.get('/page/:page/nb/:nbElement', productController.pagination);
router.get('/:idSav/article/:idProduct', productController.addProductOnSav);
router.get('/sav/:idSav', productController.productBySav);
router.get('/sav/delete/:id', productController.deleteProductOnSav);


module.exports = router;