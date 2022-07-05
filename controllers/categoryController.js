var Item = require('../models/item');
var Iteminstance = require('../models/iteminstance');
var Category = require('../models/category');
var async = require('async');

exports.category_info = function (req, res, next) {
  async.parallel(
    {
      category_info: function (callback) {
        Category.find({ _id: req.params.id }).exec(callback);
      },
      items: function (callback) {
        Item.find({ category: req.params.id })
          .sort({ price: 1 })
          .exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('category_info', {
        title: 'Category',
        data: results,
      });
    }
  );
};
