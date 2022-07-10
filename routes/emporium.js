var express = require('express');
var router = express.Router();

var item_controller = require('../controllers/itemController');
var category_controller = require('../controllers/categoryController');

// Item routes
router.get('/', item_controller.index);
router.get('/item/create', item_controller.item_create_get);
router.post('/item/create', item_controller.item_create_post);
router.get('/item/:id/delete', item_controller.item_delete_get);
router.post('/item/:id/delete', item_controller.item_delete_post);
router.get('/item/:id/update', item_controller.item_update_get);
router.post('/item/:id/update', item_controller.item_update_post);
router.get('/item/:id', item_controller.item_info);
router.post('/item/:id', item_controller.item_info_post);
router.get('/items', item_controller.items);

// Category routes
router.get('/categories/create', category_controller.category_create_get);
router.post('/categories/create', category_controller.category_create_post);
router.get('/categories/:id', category_controller.category_info);
module.exports = router;
