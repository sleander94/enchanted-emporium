var Item = require('../models/item');
var Iteminstance = require('../models/iteminstance');
var Category = require('../models/category');
var async = require('async');

exports.index = function (req, res) {
  async.parallel(
    {
      item_count: function (callback) {
        Item.countDocuments({}, callback);
      },
      iteminstance_count: function (callback) {
        Iteminstance.countDocuments({}, callback);
      },
    },
    function (err, results) {
      res.render('index', {
        title: 'Enchanted Emporium',
        error: err,
        data: results,
      });
    }
  );
};

exports.item_info = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id).populate('category').exec(callback);
      },
      item_instance: function (callback) {
        Iteminstance.countDocuments({ item: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.item === null) {
        var err = new Error('Item not found');
        err.status = 404;
        return next(err);
      }
      res.render('item_info', {
        title: results.item.name,
        item: results.item,
      });
    }
  );
};

exports.items = function (req, res, next) {
  Item.find({})
    .sort({ price: 1 })
    .exec(function (err, items) {
      if (err) {
        return next(err);
      }
      res.render('items', {
        title: 'All Items',
        items: items,
      });
    });
};

exports.item_create_get = function (req, res) {
  res.send('Item create get');
};

exports.item_create_post = function (req, res) {
  res.send('Item create post');
};

exports.item_delete_get = function (req, res) {
  res.send('Item delete get');
};

exports.item_delete_post = function (req, res) {
  res.send('Item delete post');
};
