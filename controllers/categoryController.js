var Item = require('../models/item');
var Iteminstance = require('../models/iteminstance');
var Category = require('../models/category');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.category_info = function (req, res, next) {
  async.parallel(
    {
      category_info: function (callback) {
        Category.findOne({ _id: req.params.id }).exec(callback);
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

exports.category_create_get = function (req, res, next) {
  res.render('category_form', {
    title: 'Add New Category',
  });
};

exports.category_create_post = [
  body('name', 'Name is required').trim().isLength({ min: 1 }).escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      res.render('category_form', {
        title: 'Add New Item',
        errors: errors.array(),
      });
      return;
    } else {
      Category.findOne({ name: category.name }).exec(function (err, results) {
        if (err) {
          return next(err);
        }
        if (results === null) {
          category.save(function (err) {
            if (err) {
              return next(err);
            }
            res.redirect(category.url);
          });
        } else {
          res.redirect(results.url);
        }
      });
    }
  },
];
