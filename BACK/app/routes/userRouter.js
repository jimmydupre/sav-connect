const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

/**
 * ROUTES
 **/

router.get('/', userController.findAll);
router.get('/profil', userController.getProfil);
router.get('/:id', userController.findOne);
router.get('/archive/:id', userController.archive);
router.post('/add', userController.add);
router.patch('/edit/:id', userController.edit);
router.patch('/profil', userController.editProfil);



module.exports = router;