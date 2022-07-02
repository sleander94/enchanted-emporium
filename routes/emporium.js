var express = require('express');
var router = express.Router();

var item_controller = require('../controllers/itemController');
var iteminstance_controller = require('../controllers/iteminstanceController');
var category_controller = require('../controllers/categoryController');

// Item routes
router.get('/', item_controller.index);
router.get('item/create', item_controller.item_create_get);
router.post('item/create', item_controller.item_create_post);
router.get('item/:id/delete', item_controller.item_delete_get);
router.post('item/:id/delete', item_controller.item_delete_post);
router.get('/item/:id', item_controller.item_info);
router.get('/items', item_controller.items);

module.exports = router;
