var Item = require('../models/item');
var Iteminstance = require('../models/iteminstance');
var Category = require('../models/category');
var async = require('async');
const { body, validationResult } = require('express-validator');

exports.index = function (req, res) {
  async.parallel(
    {
      item_count: function (callback) {
        Item.countDocuments({}, callback);
      },
      iteminstance_count: function (callback) {
        Iteminstance.countDocuments({}, callback);
      },
      categories: function (callback) {
        Category.find({}, callback);
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
      stock_count: function (callback) {
        Iteminstance.countDocuments({ item: req.params.id }, callback);
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
        data: results,
      });
    }
  );
};

exports.item_info_post = [
  (req, res, next) => {
    if (req.body.quantity > 0) {
      for (let i = 0; i < req.body.quantity; i++) {
        const iteminstance = new Iteminstance({
          item: req.params.id,
        });
        iteminstance.save(function (err) {
          if (err) {
            return next(err);
          }
        });
      }
    }
    if (req.body.quantity < 0) {
      for (let i = req.body.quantity; i < 0; i++) {
        Iteminstance.findOneAndRemove({ item: req.params.id }).exec(function (
          err,
          results
        ) {
          if (err) {
            return next(err);
          }
        });
      }
    }
    setTimeout(function () {
      res.redirect(`/emporium/item/${req.params.id}`);
    }, 500);
  },
];

exports.items = function (req, res, next) {
  Item.find({})
    .sort({ price: 1 })
    .exec(function (err, results) {
      if (err) {
        return next(err);
      }
      res.render('items', {
        title: 'All Items',
        data: results,
      });
    });
};

exports.item_create_get = function (req, res, next) {
  Category.find({}).exec(function (err, results) {
    if (err) {
      return next(err);
    }
    res.render('item_form', {
      title: 'Add New Item',
      categories: results,
    });
  });
};

exports.item_create_post = [
  body('name', 'Name is required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must be an integer greater than 0')
    .trim()
    .isInt({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      Category.find({}).exec(function (err, results) {
        if (err) {
          return next(err);
        }
        res.render('item_form', {
          title: 'Add New Item',
          categories: results,
          item: item,
          errors: errors.array(),
        });
      });
      return;
    } else {
      item.save(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(item.url);
      });
    }
  },
];

exports.item_delete_get = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id).exec(callback);
      },
      item_instances: function (callback) {
        Iteminstance.find({ item: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.item === null) {
        res.redirect('/emporium/items');
      }
      res.render('item_delete', {
        title: 'Delete Item',
        item: results.item,
        item_instance: results.item_instances,
      });
    }
  );
};

exports.item_delete_post = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.body.item_id).exec(callback);
      },
      item_instances: function (callback) {
        Iteminstance.find({ item: req.body.item_id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.item_instances.length > 0) {
        Iteminstance.deleteMany({ item: req.body.item_id });
      }
      Item.findByIdAndDelete(req.body.item_id, function deleteItem(err) {
        if (err) {
          return next(err);
        }
        res.redirect('/emporium/items');
      });
    }
  );
};

exports.item_update_get = function (req, res, next) {
  async.parallel(
    {
      item: function (callback) {
        Item.findById(req.params.id).exec(callback);
      },
      categories: function (callback) {
        Category.find({}, callback);
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
      res.render('item_form', {
        title: 'Update Item',
        categories: results.categories,
        item: results.item,
      });
    }
  );
};

exports.item_update_post = [
  body('name', 'Name is required').trim().isLength({ min: 1 }).escape(),
  body('description', 'Description is required')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must be an integer greater than 0')
    .trim()
    .isInt({ min: 1 })
    .escape(),

  (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      Category.find({}).exec(function (err, results) {
        if (err) {
          return next(err);
        }
        res.render('item_form', {
          title: 'Update Item',
          categories: results,
          item: item,
          errors: errors.array(),
        });
      });
      return;
    } else {
      Item.findByIdAndUpdate(req.params.id, item, {}, function (err, theitem) {
        if (err) {
          return next(err);
        }
        res.redirect(theitem.url);
      });
    }
  },
];
